<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import ImageBlock from "@/components/elements/ImageBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
</script>

<template>
    <BlogPostTemplate title="WebAssembly Compiler - Text format and AST" date="27. May, 2021">
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

        <SubHeader id="wasm-compiler">WebAssembly Compiler</SubHeader>
        <TextBlock>
            In this series of blog posts, we are going to build a compiler for the <a href="https://webassembly.org/">WebAssembly</a>
            (Wasm) text format. Not
            for the whole specification, as that would be a book and not a post, but for small sub-part of the standard
            it is possible with a few lines of Rust. We will implement just the needed structures to parse and compile a
            useful Wasm function.
            In this post, we have a look at the Wasm function we want to compile and dissect which parts we need to
            parse, to create an <a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree">Abstract Syntax Tree </a>(AST)
            from the text file. The AST is than used to compile the Wasm
            code to an executable binary format.
            In the subsequent posts of the series, we are going to build a parser, compiler and runtime for the Wasm
            code. So stay tuned for the next blog post, which will be published in the next weeks.≈
        </TextBlock>

        <SubHeader id="wasm-text-format">Wasm Text Format</SubHeader>

        <TextBlock>
            The <a href="https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format">WebAssembly
            text format</a> is a textual representation of the Wasm byte code, just like x86 assembly is for
            Intel or AMD byte code. The function below is a simple "add" function. It takes two parameters and returns
            the added result. At a first glance, it seems that there is not much going on, but from a parsers
            perspective, there is a lot of work to do to extract an AST from the code.
        </TextBlock>

        <CodeBlock>
        <pre v-highlightjs><code class="wasm">(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add)
  (export "add" (func $add))
)</code></pre>
        </CodeBlock>

        <TextBlock>
            Let us try to understand what the code does. On the highest level, Wasm is organized in a <a
                href="https://webassembly.github.io/spec/core/syntax/modules.html">module</a>. This is
            the unit of compilation and loaded by a Wasm runtime. That means that all our code needs to be contained in
            a module. Inside of the module are two structures. The first one is a <a
                href="https://webassembly.github.io/spec/core/syntax/modules.html#functions">function</a>, declared by
            the
            <i>func</i> keyword
            and the second one an <a
                href="https://webassembly.github.io/spec/core/syntax/modules.html#exports">export</a>, declared by the
            <i>export</i> keyword. The function has an identifier (id) <i>$add</i> that
            is the name of the function. It takes two parameters <i>$lhs</i> and <i>$rhs</i> of the type <i>i32</i> and
            returns a
            <i>i32</i> as the
            result. The function has three <a
                href="https://webassembly.github.io/spec/core/syntax/instructions.html#instructions">instructions</a>
            that are executed if the function is called. <a
                href="https://webassembly.github.io/spec/core/syntax/instructions.html#variable-instructions">local.get</a>
            fetches a
            parameter and puts it on the stack, such that <a
                href="https://webassembly.github.io/spec/core/syntax/instructions.html#numeric-instructions">i32.add</a>
            can add them up. The return of the result is implicit
            here, just like in Rust. Currently the function is private to the module and cannot be called from outside
            by a Wasm runtime. That is, why the export is needed. It tells the Wasm runtime that the target function
            with the identifier <i>$add</i> should be exported with the name <i>add</i> and thus can be called by the
            runtime from
            outside of the module.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wat-explained.png" alt="wasm text format"></ImageBlock>

        <TextBlock>
            Now, we understand what the code snipped does and understand its structure. But for a parser, our current
            view is not fine grained enough. Let us disassemble the Wasm text format into chunks that a parser
            understands. We are going to build a combined parser which consists of a <a
                href="https://en.wikipedia.org/wiki/Lexical_analysis">tokenizer</a> and the
            <a href="https://en.wikipedia.org/wiki/Syntactic_analysis">syntactic analysis</a> in one step. That means
            that after we ran our parser, we have either a valid AST or an error. In
            the error case, we have to check if our Wasm code is correct and if not fix it.
            <br/>
            <br/>
            The code we have in the example consist of <a
                href="https://webassembly.github.io/spec/core/text/lexical.html#tokens">tokens</a>, which are special
            keywords reserved by the language,
            <a href="https://webassembly.github.io/spec/core/text/values.html#text-id">identifiers</a> that can be set
            to arbitrary values from a given character set and
            <a href="https://webassembly.github.io/spec/core/text/values.html">value types</a> which are from a
            set of types defined by the WebAssembly specification. Furthermore the export has a <a
                href="https://webassembly.github.io/spec/core/text/values.html#names">name</a>, which is a type by
            itself.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wat-tokens.png" alt="wasm tokens"></ImageBlock>

        <TextBlock>
            The graphic above show the different parts that we need to extract and put into a AST which gives the text a
            semantic and makes it interpretable by a Wasm runtime.
        </TextBlock>

        <SubHeader id="ast">Abstract Syntax Tree (AST)</SubHeader>

        <TextBlock>
            We have seen what we need to parse but not how the result looks like. In the end we want to extract an AST
            from the text file. The AST, as the name says, is an abstract representation of our code. Boiled down to
            only the WebAssembly parts that we use it looks like this:
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/ast.png" alt="wasm tokens"></ImageBlock>

        <TextBlock>
            The AST is made up of three parts in our case. The <a
                href="https://webassembly.github.io/spec/core/syntax/modules.html#types">types</a>, the
            <a href="https://webassembly.github.io/spec/core/syntax/modules.html#functions">functions</a> and the <a
                href="https://webassembly.github.io/spec/core/syntax/modules.html#exports">exports</a>. There are many
            more
            top-level elements for a Wasm <a
                href="https://webassembly.github.io/spec/core/syntax/modules.html">module</a>, but as they do not occur
            in our example, we do not need to add them to
            the AST. Finally it is time for some Rust code. Let us port the AST diagram from above to code that we use
            for our parser.
        </TextBlock>

        <CodeBlock>
        <pre v-highlightjs><code class="rust">#[derive(Debug, PartialEq)]
pub struct Module {
    pub types: Vec&lt;Type&gt;,
    pub funcs: Vec&lt;Func&gt;,
    pub exports: Vec&lt;Export&gt;,
}</code></pre>
        </CodeBlock>

        <TextBlock>
            As our top level structure, we create a module that contains a list of types, functions and exports. We have
            only one type, function and export in our example, but we are going to build an AST and parser that has a
            structure that is easy to extend with more features from the specification. If we define a structure, we do
            it like it would be done in a full featured parser, such that we only need to add code, but not change any
            existing code if want to add more features in the future. That is why we define the the type with a
            <i>Vec</i>, as
            a Wasm module can hold more than one function, type or export. Next, let us define what a <i>Type</i> is.
        </TextBlock>

        <CodeBlock>
        <pre v-highlightjs><code class="rust">#[derive(Debug, PartialEq, Clone, Copy, Eq)]
pub enum ValueType {
    I32,
    I64,
}
pub type StackType = Vec&lt;ValueType&gt;;
pub type FuncType = (StackType, StackType);
pub type Type = FuncType;</code></pre>
        </CodeBlock>

        <TextBlock>
            A <i>Type</i> is just an alias for a <a
                href="https://webassembly.github.io/spec/core/syntax/types.html#function-types">FuncType</a> which
            itself is an alias for a
            <i>StackType</i>. The most interesting part
            is the <a href="https://webassembly.github.io/spec/core/syntax/types.html#value-types">ValueType</a>, which
            can be an
            <a href="https://webassembly.github.io/spec/core/syntax/types.html#number-types">I32</a> in our case. We can
            add more types from the specification to the
            <i>enum</i>
            if needed in the future, as an example we added the <a
                href="https://webassembly.github.io/spec/core/syntax/types.html#number-types">I64</a> type. To
            summarize, the
            <i>Type</i> is a tuple of two lists
            of <i>ValueTypes</i>. The first list contains all parameter types, the second one contains all return types.
            Now,
            to the <a href="https://webassembly.github.io/spec/core/syntax/modules.html#syntax-func">Func</a>
            definition. Each function has
            <i>Type</i> that defines what parameters it takes and what it returns. If
            two functions take the same parameters and return the same type, they share a type definition.
        </TextBlock>

        <CodeBlock>
        <pre v-highlightjs><code class="rust">#[derive(Debug, PartialEq, Clone, Eq)]
pub enum Instr {
    LocalGet(usize),
    I32Add,
}

#[derive(Debug, PartialEq, Clone, Eq)]
pub struct Func {
    pub f_type: i32,
    pub locals: Vec&lt;ValueType&gt;,
    pub body: Vec&lt;Instr&gt;,
}</code></pre>
        </CodeBlock>

        <TextBlock>
            The <a href="https://webassembly.github.io/spec/core/syntax/modules.html#functions">Func</a> contains a <i>f_type</i>
            which is a
            <a href="https://webassembly.github.io/spec/core/syntax/modules.html#syntax-typeidx">type index</a> into the
            list of types defined before. A
            <i>f_type</i> points to a
            type in the type list, which defines which parameters the functions takes and what it returns. The
            <i>locals</i>
            field is a list of possible local variables in a function. It is a list of <i>ValueType</i> and defines
            which type
            a possible local variable has. The last field is the <i>body</i> field. The body field is a list of <a
                href="https://webassembly.github.io/spec/core/syntax/instructions.html#syntax-expr">instructions</a>
            and as such the code that gets executed if the function is called. The last missing part of our module is
            the list of exports. Lets see how they are defined.
        </TextBlock>

        <CodeBlock>
        <pre v-highlightjs><code class="rust">#[derive(Debug, PartialEq, Clone, Eq)]
pub enum EDesc {
    FuncExport(usize),
}

#[derive(Debug, PartialEq, Clone, Eq)]
pub struct Export {
    pub name: String,
    pub e_desc: EDesc,
}</code></pre>
        </CodeBlock>

        <TextBlock>
            An <a href="https://webassembly.github.io/spec/core/syntax/modules.html#syntax-export">export</a> has a <a
                href="https://webassembly.github.io/spec/core/syntax/values.html#syntax-name">name</a> and an
            <a href="https://webassembly.github.io/spec/core/syntax/modules.html#syntax-exportdesc">export
                description</a>. The export description can be one of four different indices,
            but as we only need to export a function, we only need the <i>FuncExport</i> field, which is an <a
                href="https://webassembly.github.io/spec/core/syntax/modules.html#syntax-funcidx">index</a> into the
            list
            of function defined above. Each function export has a name and a pointer into the the list of functions,
            which tells the Wasm runtime, which functions is exported.
        </TextBlock>

        <SubHeader id="whats-next">What's next?</SubHeader>

        <TextBlock>
            This post laid the groundwork for building a Wasm compiler. We understood what the Wasm text format is and
            what elements it has. We saw how an abstract representation of the code can look like by defining an
            Abstract Syntax Tree. In the next blog post of this series, we are going to build the parser, which
            transforms the Wasm text format into the AST we created. You find the <router-link to="/blog/wasm-compiler2">next post here</router-link>.
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
