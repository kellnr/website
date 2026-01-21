<script setup lang="ts">

import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import ImageBlock from "@/components/elements/ImageBlock.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
</script>

<template>
    <BlogPostTemplate title="WebAssembly Compiler - Building a Runtime" date="24. June, 2021">
        <TextBlock>
            This post is one of a series of four. If you have not read the previous blog post, we strongly recommend you
            do so. The posts build on each other, as such, reading them in the right order is important.
            <br/>
            <br/>
            <ol>
                <li>
                    <router-link to="/blog/wasm-compiler1">Text format and AST</router-link>
                </li>
                <li>
                    <router-link to="/blog/wasm-compiler2">Building a Parser</router-link>
                </li>
                <li>
                    <router-link to="/blog/wasm-compiler3">Building a Compiler</router-link>
                </li>
                <li>
                    <router-link to="/blog/wasm-compiler4">Building a Runtime</router-link>
                </li>
                <li><a href="https://github.com/kellnr/blog-webassembly-compiler" target="_blank">Code on Github</a></li>
            </ol>
        </TextBlock>

        <SubHeader id="runtime">Runtime</SubHeader>
        <TextBlock>
            So far, we've built a WASM text format parser and a compiler that takes the text format as an input and
            generates a WASM binary. In this post, we're going to build a minimal runtime to execute a WASM function
            from a WASM binary. To keep the runtime as small as possible we cut some corners. For example, we will only
            implement function calls with i32 as a parameter and we reuse the existing Abstract Syntax Tree (AST),
            instead of creating a new structure that fits a more general runtime. Furthermore, we are parsing a byte
            everywhere where a LEB128 would be correct. In our example case it does not matter as a byte is always
            enough. For a real runtime, we would need to parse the correct LEB128 encoded value instead.
        </TextBlock>

        <SubHeader id="disassembler">Disassembler</SubHeader>
        <TextBlock>
            Our input for the runtime is a WASM binary blob. First, we need to disassemble the binary blob into an AST
            which we can later interpret to execute a function. The binary we want to execute is listed below.
        </TextBlock>
        <ImageBlock src="/images/kellnr/blog/wasm/wasm-hexdump.png" alt="WASM hexdump"/>
        <TextBlock>
            To get a feeling for what our disassembler needs to do, let's recap how the structure of the binary looks
            like.
        </TextBlock>

        <CodeBlock lang="asm">// wasm magic
0x00, // \0
0x61, // a
0x73, // s
0x6d, // m
// wasm version
0x01, // 1
0x00, // 0
0x00, // 0
0x00, // 0
// section "Type" (1)
0x01, // section code
0x07, // section size
0x01, // num types
// type 0
0x60, // func
0x02, // num params
0x7f, // i32
0x7f, // i32
0x01, // num results
0x7f, // i32
// section "Function" (3)
0x03, // section code
0x02, // section size
0x01, // num functions
0x00, // function 0 signature index
// section "Export" (7)
0x07, // section export
0x07, // section size
0x01, // num exports
0x03, // string length
// "add" export name
0x61, // a
0x64, // d
0x64, // d
0x00, // 0
// export kind
0x00, // export func index
// section "Code" (10)
0x0a, // section code
0x09, // section size
0x01, // num function
// function body 0
0x07, // func body size
0x00, // local decl count
0x20, // local.get
0x00, // local index
0x20, // local.get
0x01, // local index
0x6a, // i32.add
0x0b, // end</CodeBlock>

        <TextBlock>
            While we used <a href="https://github.com/Geal/nom">nom</a> as a parser combinator for the WASM text format,
            we use a hand coded parser this time. As
            the WASM binary format is very compact, this can be achieved in around 100 lines of code. Let's start top to
            bottom and parse the WASM <i>magic</i> bytes and <i>version</i> first. To make our lives a bit easier, we
            define a <i>Reader</i>
            structure, that helps us read values from the WASM binary in its raw form.
        </TextBlock>

        <CodeBlock lang="rust">use std::{cell::Cell, convert::TryInto};

pub struct Reader {
    // The wasm binary data
    data: Vec&lt;u8&gt;,
    // The current position in the binary
    pos: Cell&lt;usize&gt;,
}

impl Reader {
    pub fn new(data: Vec&lt;u8&gt;) -&gt; Self {
        Self {
            data,
            pos: Cell::new(0),
        }
    }

    pub fn len(&amp;self) -&gt; usize {
        self.data.len()
    }

    // Read a dword (u32) from the current position
    pub fn dword(&amp;self) -&gt; u32 {
        let prev = self.pos.replace(self.pos.get() + 4);
        u32::from_le_bytes(self.data[prev..self.pos.get()].try_into().unwrap())
    }

    // Read num bytes from the current position
    pub fn bytes(&amp;self, num: usize) -&gt; &amp;[u8] {
        let prev = self.pos.replace(self.pos.get() + num);
        &amp;self.data[prev..self.pos.get()]
    }

    // Read a byte from the current position
    pub fn byte(&amp;self) -&gt; u8 {
        let prev = self.pos.replace(self.pos.get() + 1);
        self.data[prev]
    }
}</CodeBlock>

        <TextBlock>
            The <i>Reader</i> helps us a lot, as it tracks what we've already read from the binary. Now, let's check if
            the header is correct.
        </TextBlock>

        <CodeBlock lang="rust">// Check if the magic header and version are correct
fn check_header(wasm: &amp;Reader) -&gt; Result&lt;(), RuntimeError&gt; {
    // The wasm binary has to be at least 8 bytes (4 magic + 4 version) in size
    if wasm.len() &lt; 8 {
        return Err(RuntimeError::ModuleToShort);
    }
    // Check the magic header
    if wasm.bytes(4) != *b"\0asm" {
        return Err(RuntimeError::WrongMagicHeader);
    }
    // Check the version
    if wasm.dword() != 1 {
        return Err(RuntimeError::WrongVersionHeader);
    }
    Ok(())
}</CodeBlock>

        <TextBlock>
            The function returns a <i>Result</i>, which is unit if everything is fine and if not, returns an <i>RuntimeError</i>.
            We need a few more runtime errors, so let's define the
            <i>RuntimeError</i> enum before we proceed.
        </TextBlock>

        <CodeBlock lang="rust">#[derive(Debug, PartialEq, Eq)]
pub enum RuntimeError {
    ModuleToShort,
    WrongMagicHeader,
    WrongVersionHeader,
    InvalidSectionCode,
    InvalidValueType,
    InvalidExportType,
    InvalidExportName,
    InvalidInstruction,
    ExportNotFound,
    InvalidArgNumber,
}</CodeBlock>

        <TextBlock>
            The next part of the binary is the <i>type</i> section. It contains a list of function types available in
            the binary.
        </TextBlock>

        <CodeBlock lang="rust">// Parse the type section
fn parse_type_section(wasm: &amp;Reader) -&gt; Result&lt;Vec&lt;Type&gt;, RuntimeError&gt; {
    // Check the section code
    if wasm.byte() != section::TYPE {
        return Err(RuntimeError::InvalidSectionCode);
    }

    // Read the size and number of types
    let _size = wasm.byte();
    let num_types = wasm.byte();
    let mut types = vec![];

    // Helper function that converts a byte to a corresponding ValueType
    fn parse_valuetype(wasm: &amp;Reader) -&gt; Result&lt;ValueType, RuntimeError&gt; {
        match wasm.byte() {
            0x7f =&gt; Ok(ValueType::I32),
            0x7e =&gt; Ok(ValueType::I64),
            _ =&gt; Err(RuntimeError::InvalidValueType),
        }
    }

    for _ in 0..num_types {
        // Read the "type" of the type. As we only support FuncType
        // we can skip the byte.
        let _func = wasm.byte();

        // parse params
        let mut params = vec![];
        for _ in 0..wasm.byte() {
            params.push(parse_valuetype(wasm)?);
        }

        // parse results
        let mut results = vec![];
        for _ in 0..wasm.byte() {
            results.push(parse_valuetype(wasm)?);
        }
        types.push((params, results));
    }
    Ok(types)
}</CodeBlock>

        <TextBlock>
            The function gives us a list of all function types. In our case we have the <i>add</i> function with the
            type
            <i>(vec![I32,I32],vec![I32])</i> as the function takes two integers and returns a single integer. The next
            section
            in the binary is the <i>function section</i>. It contains a list of function indices, which point to the
            previous
            type section.
        </TextBlock>

        <CodeBlock lang="rust">// Parse the type section
fn parse_func_section(wasm: &amp;Reader) -&gt; Result&lt;Vec&lt;i32&gt;, RuntimeError&gt; {
    // Check the section code
    if wasm.byte() != section::FUNC {
        return Err(RuntimeError::InvalidSectionCode);
    }

    // Parse the size and number of functions
    let _size = wasm.byte();
    let num = wasm.byte();
    let mut f_types = vec![];

    // Parse the indices into the type section
    for _ in 0..num {
        f_types.push(wasm.byte() as i32)
    }

    Ok(f_types)
}</CodeBlock>

        <TextBlock>
            The function section does not contain the code of the function. The code is in the <i>code section</i>,
            which is
            the last section in the binary. That means that we must construct a whole function with its type and code
            from multiple sections. The next section in the binary is the <i>export section</i>, which tells the runtime
            which
            functions are callable from the outside.
        </TextBlock>

        <CodeBlock lang="rust">// Parse the export section
fn parse_export_section(wasm: &amp;Reader) -&gt; Result&lt;Vec&lt;Export&gt;, RuntimeError&gt; {
    // Check the section code
    if wasm.byte() != section::EXPORT {
        return Err(RuntimeError::InvalidSectionCode);
    }

    // Read size and number of exports
    let _size = wasm.byte();
    let num = wasm.byte();
    let mut exports = vec![];

    for _ in 0..num {
        let length = wasm.byte();

        // Read the export name as a string
        let name = match std::str::from_utf8(wasm.bytes(length.into())) {
            Ok(n) =&gt; n.to_string(),
            Err(_) =&gt; return Err(RuntimeError::InvalidExportName),
        };
        let _zero = wasm.byte();

        // Read the export descriptor
        let e_desc = match wasm.byte() {
            0x00 =&gt; EDesc::FuncExport(0),
            _ =&gt; return Err(RuntimeError::InvalidExportType),
        };
        exports.push(Export { name, e_desc })
    }
    Ok(exports)
}</CodeBlock>

        <TextBlock>
            The function gives us the exported function, in our case the <i>add</i> function. The last section is the
            <i>code section</i>, which contains the instructions for each function, as well as optional local variables.
        </TextBlock>

        <CodeBlock lang="rust">// Parse the code section
pub fn parse_code_section(wasm: &amp;Reader) -&gt; Result&lt;Vec&lt;(StackType, Vec&lt;Instr&gt;)&gt;, RuntimeError&gt; {
    // Check the section code
    if wasm.byte() != section::CODE {
        return Err(RuntimeError::InvalidSectionCode);
    };

    // Parse the size and number of function bodies
    let _size = wasm.byte();
    let num = wasm.byte();
    let mut code = vec![];

    for _ in 0..num {
        let _size = wasm.byte();
        let num_locals = wasm.byte() as i32;
        let mut locals = vec![];
        let mut instrs = vec![];

        // Parse all locals
        for _ in 0..num_locals {
            let vt = match wasm.byte() {
                0x7f =&gt; ValueType::I32,
                0x7e =&gt; ValueType::I64,
                _ =&gt; return Err(RuntimeError::InvalidValueType),
            };
            locals.push(vt);
        }

        // Parse instructions for the function until the "end"
        // instruction is found
        loop {
            let instr = match wasm.byte() {
                0x20 =&gt; Instr::LocalGet(wasm.byte() as usize),
                0x6a =&gt; Instr::I32Add,
                0x0b =&gt; break,
                _ =&gt; return Err(RuntimeError::InvalidInstruction),
            };
            instrs.push(instr);
        }
        code.push((locals, instrs));
    }

    Ok(code)
}</CodeBlock>

        <TextBlock>
            The <i>code section</i> can contain multiple functions and each function can contain multiple locals and
            instructions. As a result, we return a list of locals and instructions for each function. Now, that we have
            parsed all section separately, let's combine them all to get an AST back from the binary code.
        </TextBlock>

        <CodeBlock lang="rust">// Parse a whole WASM module
pub fn parse_wasm(wasm: &amp;Reader) -&gt; Result&lt;Module, RuntimeError&gt; {
    // Parse all section one after the other
    check_header(wasm)?;
    let types = parse_type_section(wasm)?;
    let funcs = parse_func_section(wasm)?;
    let exports = parse_export_section(wasm)?;
    let code = parse_code_section(wasm)?;

    // Helper function to create a Func from
    // multiple sections
    let join_code_func = || {
        funcs
            .iter()
            .enumerate()
            .map(|(i, f)| Func {
                f_type: *f,
                locals: code[i].0.clone(),
                body: code[i].1.clone(),
            })
            .collect::&lt;Vec&lt;Func&gt;&gt;()
    };

    // Return a whole Module (AST)
    Ok(Module {
        types,
        exports,
        funcs: join_code_func(),
    })
}</CodeBlock>

        <TextBlock>
            Alright, we can get an AST back from a WASM binary, but we still haven't executed any code yet.
        </TextBlock>

        <SubHeader id="interpreter">Interpreter</SubHeader>
        <TextBlock>
            To be able to execute the code in our WASM module, we need an interpreter. The interpreter contains a stack
            on which all data operations take place and a virtual processor that executes instructions. As we want to
            call an exported function in the binary, let's create a function that does exactly that.
        </TextBlock>

        <CodeBlock lang="rust">// Invoke an exported function by its name with a list of i32 parameters
pub fn invoke_function(ast: &amp;Module, func: &amp;str, params: &amp;[i32]) -&gt; Result&lt;i32, RuntimeError&gt; {
    // First, check if an export with the name exists
    let export = match ast.exports.iter().find(|e| e.name == func) {
        None =&gt; return Err(ExportNotFound),
        Some(e) =&gt; e,
    };

    // Find the export descriptor for the export
    let EDesc::FuncExport(f_index) = export.e_desc;

    // Lookup the function from the export descriptor
    let func = &amp;ast.funcs[f_index];

    // Lookup the function type from the f_type index
    let f_type = &amp;ast.types[func.f_type as usize];

    // Check if the function type corresponds to the
    // number of provided parameters.
    // Note: We only support i32 here, as such we don't need to
    // check if the type matches.
    if f_type.0.len() != params.len() {
        return Err(RuntimeError::InvalidArgNumber);
    };

    // Create a new processor that takes the function from the AST
    // and the list of parameters and executes the function.
    let mut processor = Processor::new();
    processor.execute_func(&amp;func, params);

    // Get the function result from the processor state
    // and return it
    Ok(processor.get_result())
}</CodeBlock>

        <TextBlock>
            The <i>invoke_function</i> takes the AST we created with the disassembler above. Additionally, it takes the
            name of
            a function and the parameters for that function. If an export with the given function name exists in the
            AST, it gets executed by a virtual processor, which we will define next.
        </TextBlock>

        <CodeBlock lang="rust">// The processor contains a stack
// on which it works when instructions
// are executed.
pub struct Processor {
    stack: Stack,
}

impl Processor {
    pub fn new() -&gt; Self {
        Self {
            stack: Stack::new(),
        }
    }

    // Execute a function
    pub fn execute_func(&amp;mut self, func: &amp;Func, params: &amp;[i32]) {
        for instr in &amp;func.body {
            match instr {
                // If the instruction is a LocalGet, take
                // a value from the params list and push it on the stack.
                Instr::LocalGet(i) =&gt; {
                    self.stack.push(params[*i]);
                }

                // If the instruction is a I32Add, take two parameters
                // from the stack and add them. Push the result on the stack.
                Instr::I32Add =&gt; {
                    let a: i32 = self.stack.pop();
                    let b: i32 = self.stack.pop();
                    let result = a + b;
                    self.stack.push(result);
                }
            }
        }
    }

    // Get a i32 result from the stack
    pub fn get_result(&amp;mut self) -&gt; i32 {
        self.stack.pop::&lt;i32&gt;()
    }
}</CodeBlock>

        <TextBlock>
            The <i>Processor</i> for our WASM code is simple, as we have only two different instructions. What we
            implemented
            here is a so-called <a href="https://en.wikipedia.org/wiki/Stack_machine">stack machine</a>, which means
            it's a virtual computer that works only on a stack instead of
            a stack, registers and more, like a real CPU does. WebAssembly is specified with a stack machine in mind, as
            such our model fits perfectly. The processor loops through all instructions of the function and executes
            one-by-one. All data is either added (pushed) to the stack or taken from the stack (popped). The return
            value of the function is the value on the top of the stack, after the execution ended. As such, we can just
            pop the value from the stack in the <i>get_result</i> function and return it as an <i>i32</i> value. The one
            thing, we
            have not implemented yet is the magical stack that does the heavy lifting for us. Let's have a look how the
            <i>Stack</i> structure looks.
        </TextBlock>

        <CodeBlock lang="rust">// The Stack contains a mutable vector.
// The vector grows if a value is pushed and
// shrinks if a value is popped.
pub struct Stack {
    stack: Cell&lt;Vec&lt;u8&gt;&gt;,
}

impl Stack {
    pub fn new() -&gt; Self {
        Self {
            stack: Cell::new(Vec::&lt;u8&gt;::new()),
        }
    }

    // Push a value to the stack.
    // As the stack is of the type u8, the value needs to
    // be converted into a byte vector.
    pub fn push&lt;T: Stackable&gt;(&amp;mut self, arg: T) {
        let mut bytes = arg.to_bytes();
        self.stack.get_mut().append(&amp;mut bytes);
    }

    // Pop a value from the stack.
    // As the value on the stack is a u8 vector, it needs to
    // be converted into the desired type, e.g. a i32.
    pub fn pop&lt;T: Stackable&gt;(&amp;mut self) -&gt; T {
        use std::convert::TryInto;
        let bytes = self
            .stack
            .get_mut()
            .iter()
            .rev()
            .take(T::byte_size())
            .copied()
            .collect::&lt;Vec&lt;u8&gt;&gt;();
        let value = bytes.as_slice().try_into().unwrap();
        self.stack.get_mut().truncate(T::byte_size());
        T::from_bytes(value)
    }
}

// The Stackable trait need to be implemented by all
// types that we want to store on the stack. In our case
// it is just the i32.
pub trait Stackable {
    fn to_bytes(&amp;self) -&gt; Vec&lt;u8&gt;;
    fn from_bytes(stack: &amp;[u8; 4]) -&gt; Self;
    fn byte_size() -&gt; usize;
}

impl Stackable for i32 {
    // Convert i32 to bytes
    fn to_bytes(&amp;self) -&gt; Vec&lt;u8&gt; {
        self.to_ne_bytes().to_vec()
    }

    // Convert bytes to i32
    fn from_bytes(stack: &amp;[u8; 4]) -&gt; Self {
        i32::from_ne_bytes(*stack)
    }

    // Size if i32 in bytes
    fn byte_size() -&gt; usize {
        4
    }
}</CodeBlock>

        <TextBlock>
            The <i>Stack</i> is a wrapper around a mutable vector, which grows if a value is pushed and shrinks if a
            value is
            popped. As we want to be able to push different types, we allow all types that implement <i>Stackable</i> to
            be
            pushed and popped from the <i>Stack</i>. The <i>Stackable</i> trait defines function needed to convert an
            arbitrary value
            to a byte sequence storable on the stack and back into the original type. As we need only the <i>i32</i>
            type in
            our function, it is enough to implement <i>Stackable</i> for <i>i32</i>. If we need <i>i64</i>, <i>u32</i>,
            etc. in the future, we need
            to implement Stackable for them and our Stack and Processor can work with the new types as well. As a last
            step for the interpreter let's create another <i>invoke_function</i> that combines our disassembler and
            interpreter
            into one convenient function.
        </TextBlock>

        <CodeBlock lang="rust">// Take a WASM binary, a function name and function parameters.
// Execute the exported function with the given parameters and
// return the result.
pub fn invoke_function(wasm: Vec&lt;u8&gt;, f_name: &amp;str, params: &amp;[i32]) -&gt; Result&lt;i32, RuntimeError&gt; {
    let reader = Reader::new(wasm);
    let ast = parse_wasm(&amp;reader)?;
    interpreter::invoke_function(&amp;ast, f_name, params)
}</CodeBlock>

        <TextBlock>
            Now, let's revisit our <i>main</i> function from the last blog posts and add the runtime.
        </TextBlock>

        <CodeBlock lang="rust">fn main() {
    // Parse the "add.wat" file with the WASM text representation.
    let wat = read_to_string("./add.wat").expect("Failed to read wat file.");
    let ast = parser::parse(&amp;wat);

    // Compile the WASM text representation to WASM binary code and save the
    // compiled module in the file "add.wasm"
    let wasm = compiler::compile(&amp;ast);
    let mut file = File::create("add.wasm").expect("Failed to create wasm file.");
    file.write_all(&amp;wasm).expect("Failed to write wasm file.");

    // Read the compiled WASM module "add.wasm" and execute the function "add" from it.
    let mut wasm = vec![];
    File::open("add.wasm")
        .unwrap()
        .read_to_end(&amp;mut wasm)
        .unwrap();

    let result = runtime::invoke_function(wasm, "add", &amp;[5, 6]).unwrap();
    println!("5 + 6 = {}", result);
}</CodeBlock>

        <TextBlock>
            Finally, we have the full pipeline. We take a file <i>add.wat</i> with WASM text format code and parse it
            into an
            Abstract Syntax Tree. We take that AST and compile it to a WASM binary which we save in the file
            <i>add.wasm</i>.
            We read the binary again and run the <i>add</i> function with the parameters 5 and 6 through our runtime. As
            the
            result, 11 is printed based on the <i>add</i> function in the WASM code.
        </TextBlock>

        <TextBlock>
            In this series of posts, we have seen how the WASM text format and binary format look like. We wrote a
            parser for the text format and a compiler that generates WASM binary code. In this post, we wrote a minimal
            runtime that can execute the compiled WASM code.<br/>
        </TextBlock>


        <TextBlock>
            You find the other post of this series and the code here:
            <br/>
            <br/>
            <ol>
                <li>
                    <router-link to="/blog/wasm-compiler1">Text format and AST</router-link>
                </li>
                <li>
                    <router-link to="/blog/wasm-compiler2">Building a Parser</router-link>
                </li>
                <li>
                    <router-link to="/blog/wasm-compiler3">Building a Compiler</router-link>
                </li>
                <li>
                    <router-link to="/blog/wasm-compiler4">Building a Runtime</router-link>
                </li>
                <li><a href="https://github.com/kellnr/blog-webassembly-compiler" target="_blank">Code on Github</a></li>
            </ol>
        </TextBlock>

    </BlogPostTemplate>
</template>

<style scoped>

</style>
