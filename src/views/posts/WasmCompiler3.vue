<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
import ImageBlock from "@/components/elements/ImageBlock.vue";
</script>

<template>
    <BlogPostTemplate title="WebAssembly Compiler - Building a Compiler" date="05. June, 2021">
        <TextBlock>
            This post is one of a series of four. If you have not read the previous blog post, we strongly recommend you
            do so. The posts build on each other, as such, reading them in the right order is important.
            <br />
            <br />
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

        <SubHeader id="compiler">Compiler</SubHeader>
        <TextBlock>
            In the previous posts, we built a parser that converts a piece of WebAssembly (Wasm) code to an Abstract
            Syntax Tree (AST). In this post, we are going to build a compiler that takes the AST and compiles it to a
            binary format, which is executable by a Wasm runtime. The Wasm code we want to compile is shown below.
        </TextBlock>

        <CodeBlock lang="wasm">(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add)
  (export "add" (func $add))
)</CodeBlock>

        <TextBlock>
            The code is parsed to an AST that looks like the Rust snipped below.
        </TextBlock>

        <CodeBlock lang="rust">Module {
        types: vec![(vec![I32, I32], vec![I32])],

        funcs: vec![Func {
            f_type: 0,
            locals: vec![],
            body: vec![LocalGet(0), LocalGet(1), I32Add],
        }],

        exports: vec![Export {
            name: "add".to_string(),
            e_desc: FuncExport(0),
        }],
    };</CodeBlock>

        <SubHeader id="binary-format">Binary Format</SubHeader>
        <TextBlock>
            Before we write the compiler, let's have a look at the <a
                href="https://webassembly.github.io/spec/core/binary/index.html">Wasm binary format</a>. Luckily, the
            format is very
            simple compared to an <a href="https://en.wikipedia.org/wiki/Executable_and_Linkable_Format">ELF</a> binary
            on Linux or a
            <a href="https://en.wikipedia.org/wiki/Portable_Executable">PE</a> binary on Windows. The graphic below
            shows a hex dump of
            our Wasm code snipped, after it was compiled to a Wasm binary module. It is only 41 bytes long, including
            the Wasm header.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wasm-hexdump.png" alt="Wasm hex dump" />

        <TextBlock>
            Unfortunately, it is not clear, what part of the AST is what part in the binary code. To know exactly, what
            our compiler needs to do, let's annotate the hex dump with some comments.
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
            The first eight bytes contain the string "asm" and the Wasm version "1". This header is the same in every
            Wasm module, at least until a new version of the specification is released. The header is constant and tells
            a runtime that this file is indeed an executable module. Much more interesting is everything that follows
            the header. The rest of the binary blob is made up of so called <a
                href="https://webassembly.github.io/spec/core/binary/modules.html#sections">sections</a>. There are 13
            different sections in
            the Wasm specification. We need only four of them, as our code example only uses some of the features that
            Wasm provides.
        </TextBlock>

        <TextBlock>
            The sections we need to implement are:<br />
            <br />
            <ol>
                <li><a href="https://webassembly.github.io/spec/core/binary/modules.html#sections">Type Section</a></li>
                <li><a href="https://webassembly.github.io/spec/core/binary/modules.html#function-section">Function
                        Section</a></li>
                <li><a href="https://webassembly.github.io/spec/core/binary/modules.html#binary-exportsec">Export
                        Section</a></li>
                <li><a href="https://webassembly.github.io/spec/core/binary/modules.html#binary-codesec">Code
                        Section</a></li>
            </ol>
            In the rest of the blog post, we implement each of the sections in the order they occur in the binary
            module.
        </TextBlock>

        <SubHeader id="opcodes">Opcodes</SubHeader>
        <TextBlock>
            We need some <a href="https://en.wikipedia.org/wiki/Opcode">opcodes</a>, which the runtime can execute. We
            use these opcodes to build our binary. Opcodes we have to implement are:

            <ol>
                <li>Magic header ("asm")</li>
                <li>Version header ("1")</li>
                <li><a href="https://webassembly.github.io/spec/core/binary/modules.html#sections">Section Codes</a>
                </li>
                <li><a href="https://webassembly.github.io/spec/core/binary/values.html#integers">Integers (LEB128)</a>
                </li>
                <li><a href="https://webassembly.github.io/spec/core/binary/instructions.html">Instructions</a></li>
            </ol>
        </TextBlock>

        <CodeBlock lang="rust">use crate::ast::ValueType;

// "asm header"
pub const MAGIC: &amp;[u8] = &amp;[0x00, 0x61, 0x73, 0x6d];

// "version header"
pub const VERSION: &amp;[u8] = &amp;[0x01, 0x00, 0x00, 0x00];

// Encode ValueType
pub fn val_type(vt: &amp;ValueType) -&gt; u8 {
    match vt {
        ValueType::I32 =&gt; 0x7f,
        ValueType::I64 =&gt; 0x7e,
    }
}

// Section codes
// Each byte marks the start of a new section
pub mod section {
    pub const TYPE: u8 = 0x01;
    pub const CODE: u8 = 0x0a;
    pub const FUNC: u8 = 0x03;
    pub const EXPORT: u8 = 0x07;
}

// Variable instructions
pub mod var_instr {
    pub const LOCAL_GET: u8 = 0x20;
}

// Numeric instructions
pub mod num_instr {
    pub const I32_ADD: u8 = 0x6a;
}

// Indices used to point to different sections
pub mod indices {
    pub const FUNC: u8 = 0x00;
}

// Control flow instructions
pub mod control_flow {
    pub const FUNC: u8 = 0x60;
    pub const END: u8 = 0x0b;
}</CodeBlock>

        <TextBlock>
            Integers must be in the <a href="https://en.wikipedia.org/wiki/LEB128">Little Endian Base 128 (LEB128)</a>
            encoding. The encoding is used to store arbitrary
            large integers in a small number of bytes. It is used to encode all integers in the Wasm binary format. An
            implementation that takes an <i>u32</i> and returns it as an <i>LEB128</i> byte vector is just a few lines
            of code.
        </TextBlock>

        <CodeBlock lang="rust">pub fn from_u32(value: u32) -&gt; Vec&lt;u8&gt; {
    fn encode(i: u32, r: &amp;[u8]) -&gt; Vec&lt;u8&gt; {
        let b = i &amp; 0x7fu32;
        let ii = i &gt;&gt; 7;
        if ii == 0 {
            [r, &amp;[b as u8]].concat()
        } else {
            let r = [r, &amp;[(0x80u32 | b) as u8]].concat();
            encode(ii, &amp;r)
        }
    }
    encode(value, &amp;[]).to_vec()
}</CodeBlock>

        <TextBlock>
            As we want to focus on the implementation of our Wasm compiler, we will not have a closer look at how the
            <i>LEB128</i> encode works. If you are interested in the topic, have a look at the <a
                href="https://en.wikipedia.org/wiki/LEB128">Wikipedia article</a> about it.
        </TextBlock>

        <SubHeader id="type-section">Type Section</SubHeader>
        <TextBlock>
            The first section we implement is the type section. In our example code, we have one type, precisely a
            function type from the add function. Here is the relevant snipped from the AST:
        </TextBlock>

        <CodeBlock lang="rust">// Function type of "add"
// e.g. add(5, 6) -&gt; 11
types: vec![(vec![I32, I32], vec![I32])]</CodeBlock>

        <TextBlock>
            The <i>types</i> vector needs to be encoded to the following binary blob.
        </TextBlock>

        <CodeBlock lang="asm">// section "Type" (1)
0x01, // section code
0x07, // section size
0x01, // num types
// type 0
0x60, // func
0x02, // num params
0x7f, // i32
0x7f, // i32
0x01, // num results
0x7f, // i32</CodeBlock>

        <TextBlock>
            It starts with the <i>section code</i>, which is 1 in the case of the type section, followed by the size of
            the
            section and number of types it contains. In our case, we have just one type. The type itself is encoded by
            specifying what kind of type it is <i>(func type = 0x60)</i>, how many parameters it has and what type they
            are. In
            the end the result type is encoded. If we compare the binary blob with the type definition from the AST, it
            is relatively easy to see how they map to each other. Let's implement the needed code to compile the <i>type
                section</i>.
        </TextBlock>

        <CodeBlock lang="rust">// Encode the type section based on
// the list of types from the AST
fn encode_type_section(ast: &amp;Module) -&gt; Vec&lt;u8&gt; {
    // Encode one type
    fn encode_type(t: &amp;Type) -&gt; Vec&lt;u8&gt; {
        vec![
            vec![control_flow::FUNC], // Kind of type (Func = 0x60)
            vec![t.0.len() as u8], // Number of parameters
            t.0.iter().map(val_type).collect::&lt;Vec&lt;u8&gt;&gt;(), // Parameter types
            vec![t.1.len()], // Number of result types
            t.1.iter().map(val_type).collect::&lt;Vec&lt;u8&gt;&gt;(), // Result types
        ]
        .concat()
    }

    // Encode the list of types
    let body: Vec&lt;u8&gt; = ast
        .types
        .iter()
        .map(|t| encode_type(t))
        .collect::&lt;Vec&lt;Vec&lt;u8&gt;&gt;&gt;()
        .concat();

    vec![
        vec![section::TYPE], // Section code "1"
        from_u32((body.len() + 1) as u32), // Size of section
        from_u32(ast.types.len() as u32), // Number of types
        body, // The encoded types
    ]
    .concat()
}</CodeBlock>

        <TextBlock>
            We use a lot of vector concatenation to build the binary blob from the AST. This is not the fastest
            solution, but it keeps our data immutable and easy to read. We will use this pattern in all compiler
            functions.
        </TextBlock>

        <SubHeader id="function-section">Function Section</SubHeader>
        <TextBlock>
            The next section we need to encode is the <i>function section</i>. The <i>function section</i> is very
            short, as it
            contains only the number of function and which type they have. The <i>types</i> is, what we just implemented
            above.
            The code of the function is in the <i>code section</i> and not in the <i>function section</i>. The AST part
            we must
            implement is the following:
        </TextBlock>

        <CodeBlock lang="rust">funcs: vec![Func {
    f_type: 0,
    // locals: vec![], // Encoded in the code section
    // body: vec![LocalGet(0), LocalGet(1), I32Add], // Encoded in the code section
}],</CodeBlock>

        <TextBlock>
            We expect the following binary blob as the output of our <i>function section</i> compiler function.
        </TextBlock>

        <CodeBlock lang="asm">// section "Function" (3)
0x03, // section code
0x02, // section size
0x01, // num functions
0x00, // function 0 signature index</CodeBlock>

        <TextBlock>Let's implement the <i>function section</i> compiler function. Like the <i>type section</i> compiler
            function, it
            takes the AST and returns a byte vector with the encoded information.
        </TextBlock>

        <CodeBlock lang="rust">// Compile the function section from the AST
fn encode_func_section(ast: &amp;Module) -&gt; Vec&lt;u8&gt; {
    // If there are no functions,
    // return an empty byte array.
    if ast.funcs.is_empty() {
        vec![]
    } else {
        // Encode the function type index
        // for all functions.
        let body = ast
            .funcs
            .iter()
            .map(|f| f.f_type as u8)
            .collect::&lt;Vec&lt;u8&gt;&gt;();

        // Build the function section
        vec![
            vec![section::FUNC], // Section code
            from_u32((body.len() + 1) as u32), // Section length
            from_u32(ast.funcs.len() as u32), // Number of functions
            body,
        ]
        .concat()
    }
}</CodeBlock>

        <TextBlock>
            The function above encodes the list of functions from the AST. It maps the <i>f_type</i> which is the
            function type
            from the <i>type section</i> to a byte array and appends the array to the section code, section length and
            number
            of functions.
        </TextBlock>

        <SubHeader id="export-section">Export Section</SubHeader>
        <TextBlock>
            The next section we need to compile is the <i>export section</i>. It contains all exported functions from
            the AST.
            In our case only the exported <i>add</i> function. Again, let's have a look at the part of the AST we are
            talking
            about.
        </TextBlock>

        <CodeBlock lang="rust">exports: vec![Export {
    name: "add".to_string(),
    e_desc: FuncExport(0),
}],</CodeBlock>

        <TextBlock>
            The expected output of the <i>export section</i> compiler function is listed below.
        </TextBlock>

        <CodeBlock lang="asm">// section "Export" (7)
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
0x00, // export func index</CodeBlock>

        <TextBlock>
            Let's implement the <i>export section</i> compiler function. If you compare the function with the previous
            ones,
            its signature is identical. The function takes the AST and returns the compiled <i>export section</i> as a
            byte
            array.
        </TextBlock>

        <CodeBlock lang="rust">// Encode all exports from the AST
fn encode_export_section(ast: &amp;Module) -&gt; Vec&lt;u8&gt; {
    // Encode one export
    fn encode_export(export: &amp;Export) -&gt; Vec&lt;u8&gt; {
        vec![
            from_u32(export.name.len() as u32), // Length of name ("add" = 3")
            export.name.as_bytes().to_vec(), // Export name as byte array
            match export.e_desc {
                EDesc::FuncExport(_) =&gt; vec![indices::FUNC], // Export type
            },
            match export.e_desc {
                EDesc::FuncExport(idx) =&gt; vec![idx as u8], // Index into funcs
            },
        ]
        .concat()
    }
    if ast.exports.is_empty() {
        vec![]
    } else {
        // Encode all exports
        let body = ast
            .exports
            .iter()
            .map(encode_export)
            .collect::&lt;Vec&lt;Vec&lt;u8&gt;&gt;&gt;()
            .concat();
        vec![
            vec![section::EXPORT], // Section code
            from_u32((body.len() + 1) as u32), // Body length
            from_u32(ast.exports.len() as u32), // Number of exports
            body,
        ]
        .concat()
    }
}</CodeBlock>

        <TextBlock>
            Now, only one section if missing: The <i>code section</i>. It contains the instructions that are executed
            when our
            <i>add</i> function gets called.
        </TextBlock>

        <SubHeader id="code-section">Code Section</SubHeader>
        <TextBlock>
            The <i>code section</i> contains the code of all functions in the Wasm module. Again, let's have a look at
            the part
            of the AST we are talking about.
        </TextBlock>

        <CodeBlock lang="rust">funcs: vec![Func {
    // f_type: 0, Encoded in the function section
    locals: vec![],
    body: vec![LocalGet(0), LocalGet(1), I32Add],
}],</CodeBlock>

        <TextBlock>
            The only part of the <i>funcs</i> vector we care about is the <i>body</i> part, as we don't have any
            <i>locals</i>.
            It contains
            the instructions of the <i>add</i> function, which we need to encode in the <i>code section</i>. Let's have
            a look at the
            expected output.
        </TextBlock>

        <CodeBlock lang="asm">// section "Code" (10)
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
            We start with the typical section header (section code, section size, number of elements) and right after
            that, we encode the body of our first and only function. Note that this section ends with the end opcode, to
            mark the end of the function body. Let's implement the <i>code section</i> compiler function.
        </TextBlock>

        <CodeBlock lang="rust">// Encode the body (instructions) of all functions
fn encode_code_section(ast: &amp;Module) -&gt; Vec&lt;u8&gt; {
    // Encode one function body
    fn encode_func(func: &amp;Func) -&gt; Vec&lt;u8&gt; {
        // Encode one instruction
        fn encode_instr(instr: &amp;Instr) -&gt; Vec&lt;u8&gt; {
            match instr {
                Instr::LocalGet(idx) =&gt; vec![var_instr::LOCAL_GET, (*idx as u8)],
                Instr::I32Add =&gt; vec![num_instr::I32_ADD],
            }
        }
        let body = vec![
            vec![func.locals.len() as u8], // local decl count
            // Encode all instructions
            func.body
                .iter()
                .map(encode_instr)
                .collect::&lt;Vec&lt;Vec&lt;u8&gt;&gt;&gt;()
                .concat(),
            // Mark the function body with an "end"
            vec![control_flow::END],
        ]
        .concat();
        // Encoded body length
        vec![from_u32(body.len() as u32), body].concat()
    }
    if ast.funcs.is_empty() {
        vec![]
    } else {
        // Encode all function bodies
        let body = vec![
            vec![ast.funcs.len() as u8],
            ast.funcs
                .iter()
                .map(encode_func)
                .collect::&lt;Vec&lt;Vec&lt;u8&gt;&gt;&gt;()
                .concat(),
        ]
        .concat();
        // Build section header with body
        vec![vec![section::CODE], from_u32((body.len()) as u32), body].concat()
    }
}</CodeBlock>

        <TextBlock>
            That is the last section we needed to encode. The function takes the AST and returns the encoded functions
            bodies as a byte array. As a last step, we need to put all the section together to get our final Wasm
            binary.
        </TextBlock>

        <SubHeader id="compiler-function">Compiler Function</SubHeader>
        <TextBlock>
            As we now have compiler functions for all sections, let's put them together to compile a whole Wasm module
            from an AST.
        </TextBlock>

        <CodeBlock lang="rust">// Compile a Wasm module AST to a Wasm binary
pub fn compile(ast: &amp;Module) -&gt; Vec&lt;u8&gt; {
    vec![
        MAGIC,
        VERSION,
        &amp;encode_type_section(&amp;ast),
        &amp;encode_func_section(&amp;ast),
        &amp;encode_export_section(&amp;ast),
        &amp;encode_code_section(&amp;ast),
    ]
    .concat()
}</CodeBlock>

        <TextBlock>
            That's it! We set the <i>magic</i> and <i>version</i> headers followed by all sections. Note that the order
            of sections
            matters! Now, let's write a test that takes our AST and checks if the correct binary blob gets returned.
        </TextBlock>

        <CodeBlock lang="rust">#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::EDesc::FuncExport;
    use crate::ast::Instr::{I32Add, LocalGet};
    use crate::ast::ValueType::*;
    use crate::ast::*;

    #[test]
    fn compile_module_with_add_function() {
        let ast = Module {
            types: vec![(vec![I32, I32], vec![I32])],
            funcs: vec![Func {
                f_type: 0,
                locals: vec![],
                body: vec![LocalGet(0), LocalGet(1), I32Add],
            }],
            exports: vec![Export {
                name: "add".to_string(),
                e_desc: FuncExport(0),
            }],
        };

        let wasm = [
            // wasm magic
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
            0x0b, // end
        ];

        assert_eq!(compile(&amp;ast), wasm);
    }
}</CodeBlock>

        <TextBlock>
            If we did nothing wrong, the <i>assert_eq!</i> should be true, proving that our <i>compile</i> function
            works as expected.
        </TextBlock>

        <SubHeader id="execute-with-wasmtime">Execute with Wasmtime</SubHeader>
        <TextBlock>
            We are now able to parse and compile a Wasm text format module to a Wasm binary module. As we still need to
            write a Wasm runtime to execute the module, let's use <a href="https://wasmtime.dev/">Wasmtime</a> to test
            our binary in the meantime. <i>Wasmtime</i>
            is one of many free Wasm runtimes available. Every major runtime should work with some minor syntax changes.
            Just check the docs, if you use another one. Before we can use <i>Wasmtime</i> to call our <i>add</i>
            function, we need
            our Wasm module as a binary file, so let's write a short main function that takes a <i>add.wat</i> file with
            our
            Wasm code and compiles it to a binary <i>add.wasm</i> file.
        </TextBlock>

        <CodeBlock lang="rust">use std::fs::{read_to_string, File};
use std::io::Write;
mod ast;
mod compiler;
mod parser;

fn main() {
    let wat = read_to_string("./add.wat").expect("Failed to read wat file.");
    let ast = parser::parse(&amp;wat);
    let wasm = compiler::compile(&amp;ast);
    let mut file = File::create("add.wasm").expect("Failed to create wasm file.");
    file.write_all(&amp;wasm).expect("Failed to write wasm file.");
}</CodeBlock>

        <TextBlock>
            This gives us the <i>add.wasm</i> binary file that can now execute with <i>Wasmtime</i>.
        </TextBlock>

        <CodeBlock lang="bash"># Execute in shell
wasmtime add.wasm --invoke add 1 4</CodeBlock>

        <TextBlock>
            The output should looks like this:
        </TextBlock>

        <CodeBlock lang="bash">warning: using `--invoke` with a function that takes arguments is experimental and may break in the future
warning: using `--invoke` with a function that returns values is experimental and may break in the future
5</CodeBlock>

        <TextBlock>
            Ignore the first two lines, as they are just a warning that the invoke feature is not stable in
            <i>Wasmtime</i>.
            The interesting line is the third one, which prints <i>5</i>, which is the correct result of <i>1 + 4</i>.
            Our add
            functions works!
        </TextBlock>

        <SubHeader id="whats-next">What's Next?</SubHeader>
        <TextBlock>Our compiler is finished. It takes a Wasm text format module and compiles it to a Wasm binary module,
            executable by a Wasm runtime. But using <i>Wasmtime</i> to run our code feels a bit like cheating after all the
            work we put into the compiler. So, as a last step, we will write a minimal Wasm runtime that can execute our
            <i>add</i> function for us. The blog post where we write the runtime will be released in the next weeks.
        </TextBlock>
        <TextBlock>
            You find the other post of this series and the code here:
            <br />
            <br />
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

<style scoped></style>
