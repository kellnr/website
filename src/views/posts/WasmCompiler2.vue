<script setup lang="ts">

import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
import ImageBlock from "@/components/elements/ImageBlock.vue";
</script>

<template>
    <BlogPostTemplate title="WebAssembly Compiler - Building a Parser" date="30. May, 2021">

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

        <SubHeader id="parser">Parser</SubHeader>

        <TextBlock>
            Finally, we are ready to write the parser, which will convert the Wasm text format into the AST we
            implemented in the
            <router-link to="/blog/wasm-compiler1">first blog</router-link>
            post. We are using
            <a href="https://github.com/Geal/nom">nom</a>, which is a popular <a
                href="https://en.wikipedia.org/wiki/Parser_combinator">parser combinator</a> library for Rust.
            The basic idea of a parser combinator is that it provides a few very basic parser building blocks. For
            example, "read an integer", "read an ascii string" or "read until you find a $-sign". We can use these
            building blocks to combine our own parser that does more complex things, like parsing a Wasm function. But
            where do we start? With the smallest and easiest elements, we need to parse. We start with the reserved
            keywords and signs from the programming language. Let's add <i>nom</i> to our project, to be able to use it.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="toml"># Cargo.toml
[dependencies]
nom = "6"</code></pre>
        </CodeBlock>

        <TextBlock>
            For reference, here is the code Wasm code from the first blog post of the series, which we would like to
            parse. It is a simple add function that takes to integers and returns the added result. The add function is
            exported, such that it can be called from the outside with a Wasm runtime.
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

        <SubHeader id="tokens">Tokens</SubHeader>
        <TextBlock>
            Let's start by defining the parsers for the tokens we identified in our Wasm text example. The image below
            shows the code fragments we want to parse.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wat-tokens-only.png" alt="Wasm tokens"></ImageBlock>

        <TextBlock>
            The corresponding parsers with an additional whitespace parser can be implemented in a few lines of code.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// Skip whitespace
// Given a string, skip zero or more whitespace characters,
// until a non-whitespace character is reached.
pub fn ws(input: &amp;str) -&gt; IResult&lt;&amp;str, &amp;str&gt; {
    multispace0(&amp;input)
}

// Func
// Parse the string &quot;func&quot; which can be between
// zero or more whitespace characters.
pub fn func(input: &amp;str) -&gt; IResult&lt;&amp;str, &amp;str&gt; {
    bws(tag(&quot;func&quot;))(input)
}

// Param
// Parse the string &quot;param&quot; which can be between
// zero or more whitespace characters.
pub fn param(input: &amp;str) -&gt; IResult&lt;&amp;str, &amp;str&gt; {
    bws(tag(&quot;param&quot;))(input)
}

// Result
// Parse the string &quot;result&quot; which can be between
// zero or more whitespace characters.
pub fn result(input: &amp;str) -&gt; IResult&lt;&amp;str, &amp;str&gt; {
    bws(tag(&quot;result&quot;))(input)
}

// Export
// Parse the string &quot;export&quot; which can be between
// zero or more whitespace characters.
pub fn export(input: &amp;str) -&gt; IResult&lt;&amp;str, &amp;str&gt; {
    bws(tag(&quot;export&quot;))(input)
}

// Module
// Parse the string &quot;module&quot; which can be between
// zero or more whitespace characters.
pub fn module(input: &amp;str) -&gt; IResult&lt;&amp;str, &amp;str&gt; {
    bws(tag(&quot;module&quot;))(input)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            Each of the functions takes an input string and returns a result that is either an error, if the input was
            not correct, or a tuple consisting of the remaining input text and the parsed value. To create our parsers,
            we used the <a href="https://docs.rs/nom/6.1.2/nom/bytes/complete/fn.tag.html">tag</a> function from
            <i>nom</i>. This functions parses a given string and returns it, if it was present in
            the input string. The second function from <i>nom</i> that we used is <a
                href="https://docs.rs/nom/6.1.2/nom/character/complete/fn.multispace0.html">multispace0</a>. It parses
            zero or more
            whitespace characters until a non-whitespace character is reached. To make that a bit clearer, let's write
            some tests that show how the parsers are used.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn func_parse() {
        assert_eq!(func(&quot;func&quot;), Ok((&quot;&quot;, &quot;func&quot;)));
        assert_eq!(func(&quot;func foobar&quot;), Ok((&quot;foobar&quot;, &quot;func&quot;)));
        assert!(func(&quot;notfunc&quot;).is_err());
    }

    #[test]
    fn ws_parse() {
        assert_eq!(ws(&quot;  foo&quot;), Ok((&quot;foo&quot;, &quot;  &quot;)));
        assert_eq!(ws(&quot; \nfoo&quot;), Ok((&quot;foo&quot;, &quot; \n&quot;)));
        assert_eq!(ws(&quot;foo&quot;), Ok((&quot;foo&quot;, &quot;&quot;)));
    }

    #[test]
    fn param_parse() {
        assert_eq!(param(&quot;param&quot;), Ok((&quot;&quot;, &quot;param&quot;)));
        assert_eq!(param(&quot;param123&quot;), Ok((&quot;123&quot;, &quot;param&quot;)));
    }

    #[test]
    fn result_parse() {
        assert_eq!(result(&quot;result&quot;), Ok((&quot;&quot;, &quot;result&quot;)));
        assert_eq!(result(&quot;result123&quot;), Ok((&quot;123&quot;, &quot;result&quot;)));
    }

    #[test]
    fn export_parse() {
        assert_eq!(export(&quot; export &quot;), Ok((&quot;&quot;, &quot;export&quot;)));
        assert!(export(&quot;noexport&quot;).is_err());
    }

    #[test]
    fn module_parse() {
        assert_eq!(module(&quot; module &quot;), Ok((&quot;&quot;, &quot;module&quot;)));
        assert!(module(&quot;nomodule&quot;).is_err());
    }
}</code></pre>
        </CodeBlock>

        <TextBlock>
            You may have noticed that we use the <i>between-whitespace (bws)</i> function a lot, which we have not
            defined,
            yet. The parenthesis, which is present a lot in our example Wasm code, is missing too. So, let's create a
            parser which takes another parser that is between zero or more whitespaces and one that takes a parser that
            is between parentheses.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// Parenthesis
// Apply a given parser between paranthesis.
// Returns the result of the given parser without the parenthesis.
pub fn pt&lt;I, O, E: ParseError&lt;I&gt;, G&gt;(inner: G) -&gt; impl FnMut(I) -&gt; IResult&lt;I, O, E&gt;
where
    G: Parser&lt;I, O, E&gt;,
    I: Slice&lt;RangeFrom&lt;usize&gt;&gt; + InputIter,
    &lt;I as InputIter&gt;::Item: AsChar,
{
    delimited(char('('), inner, char(')'))
}

// Between whitespace
// Apply a given parser between whitespaces.
// Returns the result of the given parser without the whitespaces.
pub fn bws&lt;I, O, E: ParseError&lt;I&gt;, G&gt;(inner: G) -&gt; impl FnMut(I) -&gt; IResult&lt;I, O, E&gt;
where
    G: Parser&lt;I, O, E&gt;,
    I: InputTakeAtPosition,
    &lt;I as InputTakeAtPosition&gt;::Item: AsChar + Clone,
{
    delimited(multispace0, inner, multispace0)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            Ok, that looks difficult. The two parsers are taking a parser inner as an argument. The given parser is than
            applied with the <a href="https://docs.rs/nom/6.1.2/nom/sequence/fn.delimited.html">delimited</a> function,
            which returns only the result of its second argument. The first and the
            last argument is skipped. That allows us to apply arbitrary parsers to these two functions, as we did with
            our token parsers above, where we applied the bws parser to the tag parser to skip any surrounding
            whitespaces.
        </TextBlock>

        <SubHeader id="Values">Values</SubHeader>

        <TextBlock>
            After we defined the parsers for tokens and whitespace and parenthesis, let's create the parsers for all
            value types we need.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wat-tokens-only.png" alt="wasm tokens"></ImageBlock>

        <TextBlock>
            If you wonder why we have the <i>u32</i> parser below, as no unsigned 32 bit value is present in the code
            above, we
            need is as every identifier can be replaced by a <i>u32</i> value. To cover that case, we need to implement
            a
            parser for <i>u32</i>.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// Identifier
// Parse an identifier from a special character set
// defined by the Wasm specification. The identifier
// has to start with a &quot;$&quot; sign and can be between whitespaces.
pub fn id(input: &amp;str) -&gt; IResult&lt;&amp;str, &amp;str&gt; {
    let additional_chars = &quot;!#$%&amp;&prime;&lowast;+&minus;./:&lt;=&gt;?@∖^_`|~&quot;;
    let id_char = alt((alphanumeric1, is_a(additional_chars)));
    let id = recognize(pair(tag(&quot;$&quot;), many1(id_char)));
    bws(id)(input)
}

// U32
// Parse an unsigned 32 bit integer value.
pub fn u32(input: &amp;str) -&gt; IResult&lt;&amp;str, u32&gt; {
    map(digit1, |d: &amp;str| {
        d.parse().expect(&quot;Integer format not supported&quot;)
    })(input)
}

// Literal
// Parse a literal string between quotes. The literal
// can be between whitespaces.
pub fn literal(input: &amp;str) -&gt; IResult&lt;&amp;str, String&gt; {
    map(
        bws(delimited(char('&quot;'), is_not(&quot;\&quot;&quot;), char('&quot;'))),
        |s: &amp;str| s.to_string(),
    )(input)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            Let's go over each function to see what it does and how it works. The <i>id</i> function takes a string as
            an input
            and parses an <a href="https://webassembly.github.io/spec/core/text/values.html#text-id">identifier</a> like
            <i>$add</i> from it. An identifier always starts with a $-sign and has a set of
            allowed characters which is either alpha-numeric or from the characters defined in the
            <i>additional_chars</i>
            variable. We are using the <a href="https://docs.rs/nom/6.1.2/nom/branch/fn.alt.html">alt</a> function from
            <i>nom</i> to parse an <a
                href="https://docs.rs/nom/6.1.2/nom/character/complete/fn.alphanumeric1.html">alphanumeric1</a>
            or
            <i>additional_chars</i> character.
            The <a href="https://docs.rs/nom/6.1.2/nom/combinator/fn.recognize.html">recognize</a> function from
            <i>nom</i> combines the <a href="https://docs.rs/nom/6.1.2/nom/sequence/fn.pair.html">pair</a> of "$" and
            our defined characters to a string, which is
            our final identifier.
            <br />
            <br />
            Compared to the <i>id</i> parser, the <i>u32</i> parser is simple. It takes a string and parses at least one
            digit from it
            with the <a href="https://docs.rs/nom/6.1.2/nom/character/complete/fn.digit1.html">digit1</a> parser from
            <i>nom</i>. As the <i>digit1</i> parser returns a <i>string</i> and not a <i>u32</i>, we need to map the
            parsed <i>string</i> to an <i>u32</i> value. To do so, we use the <a
                href="https://docs.rs/nom/6.1.2/nom/combinator/fn.map.html">map</a> function from <i>nom</i>. In the
            case that the parsed
            string is not convertible to a <i>u32</i> value, we just crash with an error message to keep the error
            handling
            simple for our example parser.
            <br />
            <br />
            The last value parser we need is the <i>literal</i> parser. A literal is any string between quotes. In our
            Wasm
            example the export <a href="https://webassembly.github.io/spec/core/text/values.html#names">name</a> "add"
            is a literal. To parse a literal, we use the already known
            <a href="https://docs.rs/nom/6.1.2/nom/sequence/fn.delimited.html">delimited</a> parser to
            skip the quotes around the string we want to parse. We take all characters that are not a single quote in
            between, with the help of the <a href="https://docs.rs/nom/6.1.2/nom/bytes/complete/fn.is_not.html">is_not</a>
            parser. In the end, we map
            the
            <i>&str</i> to an owned <i>String</i>, which we
            return.
            <br />
            <br />
            Again, let's write a few tests to make the usage of the parser clearer.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn id_parse() {
        assert_eq!(id(&quot;$valid_id%#! foo &quot;), Ok((&quot;foo &quot;, &quot;$valid_id%#!&quot;)));
        assert_eq!(id(&quot;  $valid_id%#! foo &quot;), Ok((&quot;foo &quot;, &quot;$valid_id%#!&quot;)));
        assert!(id(&quot;valid_id%#! foo &quot;).is_err());
    }

    #[test]
    fn u32_parse() {
        assert_eq!(u32(&quot;12&quot;), Ok((&quot;&quot;, 12)));
    }

    #[test]
    fn literal_parse() {
        assert_eq!(
            literal(&quot;\&quot;valid#+123\&quot;&quot;),
            Ok((&quot;&quot;, &quot;valid#+123&quot;.to_string()))
        );
        assert!(literal(&quot;invalid&quot;).is_err());
    }
}</code></pre>
        </CodeBlock>

        <SubHeader id="context">Context</SubHeader>

        <TextBlock>
            Before we continue with more parsers, we need to implement a <a
                href="https://webassembly.github.io/spec/core/valid/conventions.html?highlight=context#contexts">context</a>.
            The context helps us to keep track of
            what we've already parsed and is needed to replace some values in place. For example, if we find an
            identifier like <i>$add</i> in an export, we need to translate it to an integer index value, which points
            into the
            list of functions. Many of the parsers we write, need the context to replace some intermediate values. The
            context itself is similar to AST. In fact, in our small example we could replace one with the other, as we
            do not implement enough features to show where the AST and the context differ. But as we said, we want to
            create an extensible compiler, we add an additional context struct.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">#[derive(Clone, PartialEq, Eq, Debug)]
pub struct Ctx {
    pub locals: Vec&lt;Option&lt;String&gt;&gt;,
    pub types: Field&lt;Type&gt;,
    pub funcs: Field&lt;Func&gt;,
    pub exports: Field&lt;Export&gt;,
}

#[derive(Clone, PartialEq, Eq, Debug)]
pub struct Field&lt;T&gt; {
    pub ids: Vec&lt;Option&lt;String&gt;&gt;,
    pub list: Vec&lt;T&gt;,
}</code></pre>
        </CodeBlock>

        <TextBlock>
            The context is defined through a struct <i>Ctx</i>. The struct contains possible local variables, the types,
            functions, and exports we have parsed so far. This means that we add a type, function, or export as soon as
            we see it in the source code to the current context, such that all following parsers have access to the
            information it contains. The <i>locals</i> are a bit special. They are not saved for the whole parser run
            through
            the complete Wasm code, but instead are only used within a function parser. This makes sense, as
            <i>locals</i> are
            scoped to the function they belong to. If we encounter a function, we use it to parse the function and then
            clear the <i>locals</i> field to use it again in the next function.
            <br />
            <br />
            The <i>Field</i> struct holds a list of the possible structure, e.g., a <i>Type</i> or <i>Func</i> and
            additionally a list of all
            possible identifiers that are an "alias" for one of the types in the list. We need this information, to be
            able to replace an identifier we encounter with the needed index value in one of the lists. For example, if
            the parse has an export which exports a function identified by $add, we need to replace the <i>$add</i>
            identifier
            with the index of the add-function in the <i>funcs</i> field of the context.
            <br />
            <br />
            To make our lives a bit easier, we define a few helper functions that allow easy inserts and lookups into
            our context.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">impl&lt;T&gt; Field&lt;T&gt; {
    // Create a new and empty field
    pub fn new() -&gt; Self {
        Self {
            ids: Vec::new(),
            list: Vec::new(),
        }
    }

    // Add an item and an id to the field
    pub fn add(&amp;mut self, id: Option&lt;String&gt;, item: T) {
        self.add_item(item);
        self.add_id(id);
    }

    // Add only an item to the field
    pub fn add_item(&amp;mut self, item: T) {
        self.list.push(item);
    }

    // Add inly an id to the field
    pub fn add_id(&amp;mut self, id: Option&lt;String&gt;) {
        self.ids.push(id)
    }
}</code></pre>
        </CodeBlock>

        <TextBlock>
            For the context, we need a few more functions to help us parse more complex Wasm structures.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">impl Ctx {
    // Create an new and empty context
    pub fn new() -&gt; Self {
        Self {
            locals: Vec::new(),
            types: Field::new(),
            funcs: Field::new(),
            exports: Field::new(),
        }
    }

    // Get the index of a function from the list of functions.
    pub fn get_func_idx(&amp;self, idx: &amp;Index) -&gt; usize {
        match idx {
            Index::Idx(i) =&gt; *i,
            Index::Id(id) =&gt; self
                .funcs
                .ids
                .iter()
                .position(|i| i == &amp;Some(id.to_owned()))
                .expect(&quot;Func id has to exists&quot;),
        }
    }

    // Insert a local id into the list of locals
    pub fn insert_local_id(&amp;mut self, id: &amp;Option&lt;string&gt;
    ) {
        if id.is_some() &amp;&amp; self.locals.contains(id) {
            panic!(&quot;Local identifiers have to be unique in the scope of the function&quot;)
        } else {
            self.locals.push((*id).clone());
        }
    }

    // Get the index of a local from the list of locals
    pub fn get_local_idx(&amp;self, index: &amp;Index) -&gt; usize {
        match index {
            Index::Idx(i) =&gt; *i,
            Index::Id(id) =&gt; self
                .locals
                .iter()
                .position(|x| x == &amp;Some(id.clone()))
                .expect(&quot;Identifier not found&quot;),
        }
    }

    // Insert a function id to the list of functions and
    // return the index of the newly added id.
    pub fn insert_func_id(&amp;mut self, id: Option&lt;string&gt;
     ) -&gt; usize {
        self.funcs.add_id(id);
        self.funcs.ids.len() - 1
    }

    // Insert a function type into the list of types.
    pub fn insert_id_func_type(&amp;mut self, id: Option&lt;string&gt;, t: &amp;FuncType) {
        self.types.add(id, (*t).clone());
    }

    // Get the index from a function type fromt the list of types.
    pub fn get_idx_from_func_type(&amp;self, ft: &amp;FuncType) -&gt; Option&lt;usize&gt;
       {
        self.types.list.iter().position(|t| t == ft)
    }

    // Insert a function type into the list of types and return the
    // index of the newly added type.
    pub fn insert_func_type_get_idx(&amp;mut self, ft: &amp;FuncType) -&gt; usize {
        self.insert_id_func_type(None, ft);
        self.get_idx_from_func_type(&amp;ft).expect(&quot;Type has to exist&quot;)
    }

    // Insert the function type into the list of type only
    // if it does not exist already. Return the index of the
    // function type that was tried to add.
    pub fn upsert_func_type(&amp;mut self, ft: &amp;FuncType) -&gt; usize {
        match self.get_idx_from_func_type(ft) {
            None =&gt; self.insert_func_type_get_idx(ft),
            Some(i) =&gt; i,
        }
    }

    // Insert a function to the list of functions.
    pub fn insert_func(&amp;mut self, func: &amp;Func) {
        self.funcs.add_item((*func).clone());
    }

    // Insert an export to the list of exports
    pub fn insert_export(&amp;mut self, id: &amp;Option&lt;string&gt;, export: &amp;Export) {
        self.exports.add((*id).clone(), (*export).clone());
    }
}</code></pre>
        </CodeBlock>

        <TextBlock>
            While this is a lot of code with many functions, they basically all do the same. There is a function that
            adds a <i>type</i>, <i>func</i>, <i>export</i> or <i>local</i> to the current context, or reads an index for
            one of the types from the
            context. You may have noticed that we clone some of the values into the context. That is not the best option
            performance and memory wise, but for our example it is more than enough, and it keeps the code easy to read.
            The context is usually wrapped in a <i>&amp;mut Rc&lt;RefCell&lt;Ctx&gt;&gt;</i>. We need to wrap the
            context,
            because the same context is owned by multiple functions at once and needs interior mutability. The <i>&amp;mut
                Rc&lt;RefCell&lt;Ctx&gt;&gt;</i> construct allows exactly that. Equipped with our newly created context, we
            can
            return to building parsers for our missing Wasm structures.
        </TextBlock>

        <SubHeader id="types">Types</SubHeader>

        <TextBlock>
            There are multiple types we can encounter in our Wasm example. Namely the <a
                href="https://webassembly.github.io/spec/core/syntax/types.html#function-types">FuncType</a> and the <a
                href="https://webassembly.github.io/spec/core/syntax/types.html#value-types">ValueType</a>.
            Additionally, we need a <i>type-use</i> and an <i>index</i> parser, which are needed to correctly parse the
            <i>FuncType</i> and
            <i>ValueType</i>. Let's start with the index parser, as it is easy to understand.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wat-types.png" alt="wasm text"></ImageBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// An Index can either be an unsigned integer, e.g. &quot;1&quot;
// or an identifier, e.g. &quot;$add&quot;.
pub enum Index {
    Idx(usize),
    Id(String),
}

// Parse an Index from a given string.
pub fn index(input: &amp;str) -&gt; IResult&lt;&amp;str, Index&gt; {
    let idx = map(values::u32, |u| Index::Idx(u as usize));
    let id = map(values::id, |id| Index::Id(id.to_string()));
    alt((idx, id))(input)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            For the index parser, we are using our value <i>u32</i> and <i>id</i> parsers, we defined above. In our
            example the export
            uses the identifier <i>$add</i>, but instead it could directly use the index "0" to point to the index in
            the
            <i>funcs</i>
            list of the context. The <i>Index enum</i> allows us to handle both cases, a direct index of type <i>u32</i>
            or a
            <i>string</i>
            identifier.
            <br />
            <br />
            Next, let's create a parser for the <i>ValueType</i> defined in the AST. As we defined the AST in the
            previous blog
            post, here is the <i>ValueType</i> definition again.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">#[derive(Debug, PartialEq, Clone, Copy, Eq)]
pub enum ValueType {
    I32,
    I64,
}</code></pre>
        </CodeBlock>

        <TextBlock>
            The corresponding parser function looks like this:
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">pub fn value_type(input: &amp;str) -&gt; IResult&lt;&amp;str, ValueType&gt; {
    let types = alt((value(I32, tag(&quot;i32&quot;)), value(I64, tag(&quot;i64&quot;))));
    bws(types)(input)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            The function takes an input <i>string</i> and returns one of the possible <i>ValueType</i> instances. One of
            the more
            complex parsers is next. The <i>FuncType</i> parser is quite complicated, so let's have a closer look. Let's
            recall
            the definition for the <i>FuncType</i> from the AST.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">pub type StackType = Vec&lt;ValueType&gt;;
pub type FuncType = (StackType, StackType);</code></pre>
        </CodeBlock>

        <TextBlock>
            The <i>FuncType</i> is just an alias for a tuple of <i>StackTypes</i>, which is a vector of
            <i>ValueTypes</i> which we just
            written the parser for. An example for <i>FuncType</i> in Wasm is <i>(param $lhs i32) (param $rhs i32)
                (result i32)</i>.
            Parsed to a <i>FuncType</i> it results in the tuple <i>(vec![i32, i32], vec![i32])</i>, as it has two
            parameters of the
            type <i>i32</i> and one return value of the type <i>i32</i>.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// Takes a given string and context and returns a FuncType.
pub fn func_type&lt;'a&gt;(input: &amp;'a str, ctx: &amp;mut Rc&lt;RefCell&lt;Ctx&gt;&gt;) -&gt; IResult&lt;&amp;'a str, FuncType&gt; {
    // Declare a helper enum, as we need to parse
    // either a Return value &quot;R&quot; or a parameter &quot;P&quot;.
    // The parameter has an optional idenfifier, like &quot;$lhs&quot; or &quot;$rhs&quot;
    // in our example.
    #[derive(Clone)]
    enum PR {
        R(ValueType), // Return type
        P(ValueType, Option&lt;String&gt;), // Paremeter type
    }

    // Parse a parameter with an optional identifier
    let p = map(
        preceded(
            ws,
            token::pt(tuple((token::param, values::id, types::value_type))),
        ),
        |p| PR::P(p.2, p.1.and_then(|id| Some(id.to_string()))),
    );

    // Parse a result type
    let r = map(
        preceded(ws, token::pt(preceded(token::result, types::value_type))),
        PR::R,
    );

    // Parse a type &quot;t&quot; that is either a parameter &quot;p&quot; or a result type &quot;r&quot;.
    let t = alt((p, r));

    // Parse multiple types &quot;t&quot;
    let (input, many_t) = many0(t)(input)?;

    // Get all result types from the list
    // of parsed types.
    let results = many_t
        .iter()
        .filter_map(|t| match t {
            PR::R(r) =&gt; Some(*r),
            PR::P(_, _) =&gt; None,
        })
        .collect::&lt;Vec&lt;ValueType&gt;&gt;();

    // get all parameter types from the list
    // of parsed types.
    let params = many_t
        .iter()
        .filter_map(|t| match t {
            PR::R(_) =&gt; None,
            PR::P(p, id) =&gt; {
                ctx.borrow_mut().insert_local_id(id); // Insert the id into the context
                Some(*p)
            }
        })
        .collect::&lt;Vec&lt;ValueType&gt;&gt;();

    // Combine the list of parameters and result types to
    // the FuncType tuple and return the result.
    let ft = (params, results);
    Ok((input, ft))
}</code></pre>
        </CodeBlock>

        <TextBlock>
            Fortunately, that's the most complex parser we have to write to parse our Wasm example. It is also the first
            parser that needs the context. It uses the context to insert any identifiers it finds for later use. The
            usage should become clearer, when we write a few tests for the <i>FuncType</i> parser. Before we write some
            test,
            let's define the last missing type, the <i>type-use</i>. The <i>type-use</i> is not a real type, but an
            index into the
            <i>funcs</i> list. It tells the Wasm runtime that this function type is used. That's where the name comes
            from.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// Takes an input string and a context and returns
// The index of the parsed FuncType in the types list of
// the context.
pub fn type_use&lt;'a&gt;(input: &amp;'a str, ctx: &amp;mut Rc&lt;RefCell&lt;Ctx&gt;&gt;) -&gt; IResult&lt;&amp;'a str, usize&gt; {
    // Partially apply the func_type parser to bind our context to it.
    let mut ft = |i| func_type(i, ctx);
    // Parse a FuncType
    let (input, ft) = ft(input)?;
    // Insert the parsed FuncType into the context and return
    // the index of the added type.
    let index = ctx.borrow_mut().upsert_func_type(&amp;ft);
    Ok((input, index))
}</code></pre>
        </CodeBlock>

        <TextBlock>
            While the function seems straight forward, there is one point we need to have a closer look at. Due to the
            structure of all <i>nom</i> parsers, it is impossible to combine parsers that take more than one argument.
            Unfortunately, the <i>func_type</i> parser takes a string reference and a context. So, it is not possible to
            combine or apply the parser with <i>nom</i>. To work around this constrains, we use a technique popular in
            functional programming called <a href="https://en.wikipedia.org/wiki/Partial_application">partial
                application</a>. The idea of partial application is to give a function
            only a few of its required arguments and bind it to a new name. We are doing that with <i>let mut ft = |i|
                func_type(i, ctx)</i>. Here, we create a new function <i>ft</i> that takes only one argument (the input
            string) and has
            its second argument bound to the <i>ctx</i> instance of the context. We can now use the newly defined
            function ft
            anywhere, where we would have used <i>func_type</i>, but weren't able to, due to the restriction of having
            only one
            argument. That's a neat trick we will use a few more times in the rest of the parsers for our Wasm example.
            <br />
            <br />
            Before we start implementing the instructions parsers, let's create a few tests for the type parsers to
            check if they work and show how they are used.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn func_type_parse_1() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;(param $lhs i32)&quot;, &amp;mut ctx),
            Ok((&quot;&quot;, (vec![I32], vec![])))
        );
        assert_eq!(
            Ctx {
                locals: vec![Some(&quot;$lhs&quot;.to_string())],
                ..Ctx::new()
            },
            *ctx.borrow_mut()
        );
    }

    #[test]
    fn func_type_parse_2() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;(param $lhs i32) (param $rhs i32) &quot;, &amp;mut ctx),
            Ok((&quot; &quot;, (vec![I32, I32], vec![])))
        );
        assert_eq!(
            Ctx {
                locals: vec![Some(&quot;$lhs&quot;.to_string()), Some(&quot;$rhs&quot;.to_string())],
                ..Ctx::new()
            },
            *ctx.borrow_mut()
        );
    }

    #[test]
    fn func_type_parse_3() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;(xparam $lhs u32)&quot;, &amp;mut ctx),
            Ok((&quot;(xparam $lhs u32)&quot;, (vec![], vec![])))
        );
    }

    #[test]
    fn func_type_parse_4() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;param $lhs u32&quot;, &amp;mut ctx),
            Ok((&quot;param $lhs u32&quot;, (vec![], vec![])))
        );
    }

    #[test]
    fn func_type_parse_5() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;(param xlhs u32)&quot;, &amp;mut ctx),
            Ok((&quot;(param xlhs u32)&quot;, (vec![], vec![])))
        );
    }

    #[test]
    fn func_type_parse_6() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;(param $lhs i32)&quot;, &amp;mut ctx),
            Ok((&quot;&quot;, (vec![I32], vec![])))
        );
    }

    #[test]
    fn func_type_parse_7() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;(param $lhs i32) (param $rhs i32) (result i64)&quot;, &amp;mut ctx),
            Ok((&quot;&quot;, (vec![I32, I32], vec![I64])))
        );
    }

    #[test]
    fn func_type_parse_8() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            func_type(&quot;(param i32) (param i32) (result i64)&quot;, &amp;mut ctx),
            Ok((&quot;&quot;, (vec![I32, I32], vec![I64])))
        );
    }

    #[test]
    fn value_type_parse() {
        assert_eq!(value_type(&quot;i32&quot;), Ok((&quot;&quot;, I32)));
        assert_eq!(value_type(&quot;i64&quot;), Ok((&quot;&quot;, I64)));
        assert!(value_type(&quot;x32&quot;).is_err());
    }
}</code></pre>
        </CodeBlock>

        <SubHeader id="instructions">Instructions</SubHeader>

        <TextBlock>
            In our example Wasm code, we have only two instructions, the <i>local.get</i> and the <i>i32.add</i>
            instruction. Let's
            write a parser for each and one additional that combines both to be able to parse any instruction we can
            encounter.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wat-instr.png" alt="wasm text"></ImageBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// Parse the local.get instruction followed by an Index from a string.
fn local_get&lt;'a&gt;(input: &amp;'a str, ctx: &amp;Rc&lt;RefCell&lt;Ctx&gt;&gt;) -&gt; IResult&lt;&amp;'a str, Instr&gt; {
    let local_get = bws(tag(&quot;local.get&quot;));
    let (input, i) = preceded(local_get, index)(input)?;
    // Get the index from the context for the parsed Index.
    let i = ctx.borrow().get_local_idx(&amp;i);
    Ok((input, Instr::LocalGet(i)))
}

// Parse the i32.add instruction from a string
fn i32_add(input: &amp;str) -&gt; IResult&lt;&amp;str, Instr&gt; {
    map(bws(tag(&quot;i32.add&quot;)), |_| I32Add)(input)
}

// Parse one or more instructions from a string
pub fn instrs&lt;'a&gt;(input: &amp;'a str, ctx: &amp;mut Rc&lt;RefCell&lt;Ctx&gt;&gt;) -&gt; IResult&lt;&amp;'a str, Vec&lt;Instr&gt;&gt; {
    // Partially apply the function to bind the context to it.
    let lg = |i| local_get(i, ctx);
    let instruction = alt((lg, i32_add));
    many1(bws(instruction))(input)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            The <i>i32_add</i> function is straight forward. It parses the <i>i32.add</i> tag and maps it to the
            <i>I32Add</i>
            instruction.
            The <i>local_get</i> function is more interesting as it takes the context in addition to the input string.
            The
            context is used to replace any identifier that follows the <i>local.get</i> instruction with its
            corresponding
            index. In our example, <i>local.get $lhs</i> would be parsed to <i>LocalGet(0)</i>, while <i>local.get
                $rhs</i> would be parsed
            to <i>LocalGet(1)</i>. The <i>instrs</i> function uses the partial application trick to bind the context,
            again. It tries
            to parse one or more of the supported instructions and returns them as a vector of instructions. To make the
            usage of the function clearer, let's write a few tests.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::Instr::LocalGet;

    #[test]
    fn local_get_parse() {
        let ctx = Rc::new(RefCell::new(Ctx {
            locals: vec![Some(&quot;$lhs&quot;.to_string())],
            ..Ctx::new()
        }));
        assert_eq!(local_get(&quot;local.get 1&quot;, &amp;ctx), Ok((&quot;&quot;, Instr::LocalGet(1))));
        assert_eq!(
            local_get(&quot;local.get $lhs&quot;, &amp;ctx),
            Ok((&quot;&quot;, Instr::LocalGet(0)))
        );
    }

    #[test]
    fn i32_add_parse() {
        assert_eq!(i32_add(&quot; i32.add &quot;), Ok((&quot;&quot;, I32Add)));
        assert!(i32_add(&quot;local.get&quot;).is_err());
    }

    #[test]
    fn instrs_parse() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));
        assert_eq!(
            instrs(
                &quot;local.get 1\
                i32.add\
                local.get 2&quot;,
                &amp;mut ctx
            ),
            Ok((&quot;&quot;, vec![LocalGet(1), I32Add, LocalGet(2)]))
        );
    }
}</code></pre>
        </CodeBlock>

        <SubHeader id="module">Module</SubHeader>

        <TextBlock>
            We are close to finishing the Wasm parser. The last part we need to implement is the module parser with the
            function and export parsers. After that, we can finally parse the whole Wasm example code!
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/wasm/wat-module.png" alt="wasm module"></ImageBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">// Parse a function with its type definition and instructions.
fn func&lt;'a&gt;(input: &amp;'a str, ctx: &amp;mut Rc&lt;RefCell&lt;Ctx&gt;&gt;) -&gt; IResult&lt;&amp;'a str, Func&gt; {
    fn inner&lt;'a&gt;(input: &amp;'a str, ctx: &amp;mut Rc&lt;RefCell&lt;Ctx&gt;&gt;) -&gt; IResult&lt;&amp;'a str, Func&gt; {
        // Parse the identifier of the function
        let (input, id) = preceded(token::func, values::id)(input)?;
        // Insert the id into the context
        ctx.borrow_mut().insert_func_id(Some(id.to_string()));
        // Parse the type-use (parameters and result type)
        let (input, f_type) = types::type_use(input, ctx)?;
        // Parse the instruction body
        let (input, instrs) = instr::instrs(input, ctx)?;
        let f = Func {
            f_type: f_type as i32,
            locals: vec![],
            body: instrs,
        };
        Ok((input, f))
    }
    // Partially apply the context
    let in_pt = |i| inner(i, ctx);
    // Parse the function between parenthesis
    let (input, func) = token::pt(in_pt)(input)?;
    // Insert the parsed function into the context
    ctx.borrow_mut().insert_func(&amp;func);
    Ok((input, func))
}

// Parse a function export
fn export&lt;'a&gt;(input: &amp;'a str, ctx: &amp;mut Rc&lt;RefCell&lt;Ctx&gt;&gt;) -&gt; IResult&lt;&amp;'a str, Export&gt; {
    // Parse the function index
    let index = token::pt(preceded(token::func, types::index));
    // Parse the export
    let mut exp = token::pt(preceded(token::export, tuple((values::literal, index))));
    let (input, (lit, idx)) = exp(input)?;
    // Create the export struct
    let export = Export {
        name: lit.clone(),
        e_desc: FuncExport(ctx.borrow().get_func_idx(&amp;idx)), // Replace the identifier with the index
    };
    // Insert the export into the context
    ctx.borrow_mut().insert_export(&amp;Some(lit), &amp;export);
    Ok((input, export))
}

// Parse a Wasm module with functions, types and exports
pub fn module(input: &amp;str) -&gt; IResult&lt;&amp;str, Module&gt; {
    // Create a new contex
    let ctx = Rc::new(RefCell::new(Ctx::new()));
    // Apply the context to the function parser
    let func_ctx = |i| func(i, &amp;mut ctx.clone());
    // Apply the context to the export parser
    let export_ctx = |i| export(i, &amp;mut ctx.clone());
    // Parse a module field, which is either a function or an export
    let mod_field = bws(many0(bws(alt((
        map(func_ctx, |_| ()),
        map(export_ctx, |_| ()),
    )))));
    // Parse the module itself
    let _ = preceded(ws, token::pt(preceded(token::module, mod_field)))(input)?;
    // Copy the parsed functions, types and export from the context to the AST
    let module = Module {
        types: ctx.borrow().types.list.clone(),
        funcs: ctx.borrow().funcs.list.clone(),
        exports: ctx.borrow().exports.list.clone(),
    };
    // Return the parsed module (AST)
    Ok((&quot;&quot;, module))
}</code></pre>
        </CodeBlock>

        <TextBlock>
            And that's it. We are now able to parse the whole Wasm code example into an Abstract Syntax Tree, which we
            can use to compile the code. As a final step, let's write a test for the function and export parser and one
            that parses the whole module.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">#[cfg(test)]
mod tests {
    use super::*;
    use crate::ast::Instr::*;
    use crate::ast::ValueType::I32;
    use crate::parser::ctx::Field;

    #[test]
    fn func_parse() {
        let mut ctx = Rc::new(RefCell::new(Ctx::new()));

        let wat = &quot;(func $add (param $lhs i32) (param $rhs i32) (result i32)
              local.get $lhs
              local.get $rhs
              i32.add)&quot;;

        let expected = Func {
            f_type: 0,
            locals: vec![],
            body: vec![LocalGet(0), LocalGet(1), I32Add],
        };

        assert_eq!(func(&amp;wat, &amp;mut ctx), Ok((&quot;&quot;, expected.clone())));
        assert_eq!(
            ctx,
            Rc::new(RefCell::new(Ctx {
                locals: vec![Some(&quot;$lhs&quot;.to_string()), Some(&quot;$rhs&quot;.to_string())],
                types: Field {
                    ids: vec![None],
                    list: vec![(vec![I32, I32], vec![I32])],
                },
                funcs: Field {
                    ids: vec![Some(&quot;$add&quot;.to_string())],
                    list: vec![expected]
                },
                exports: Field::new()
            }))
        )
    }

    #[test]
    fn export_parse() {
        let mut ctx = Rc::new(RefCell::new(Ctx {
            funcs: Field {
                ids: vec![Some(&quot;$add&quot;.to_string())],
                list: vec![],
            },
            ..Ctx::new()
        }));

        let expected = Export {
            name: &quot;add&quot;.to_string(),
            e_desc: FuncExport(0),
        };

        assert_eq!(
            export(&quot;(export \&quot;add\&quot; (func $add))&quot;, &amp;mut ctx),
            Ok((&quot;&quot;, expected))
        );
        assert_eq!(
            ctx,
            Rc::new(RefCell::new(Ctx {
                locals: vec![],
                types: Field::new(),
                funcs: Field {
                    ids: vec![Some(&quot;$add&quot;.to_string())],
                    list: vec![]
                },
                exports: Field {
                    ids: vec![Some(&quot;add&quot;.to_string())],
                    list: vec![Export {
                        name: &quot;add&quot;.to_string(),
                        e_desc: EDesc::FuncExport(0)
                    }]
                }
            }))
        )
    }

    #[test]
    fn module_parse() {
        let wat = &quot;(module
                (func $add (param $lhs i32) (param $rhs i32) (result i32)
                  local.get $lhs
                  local.get $rhs
                  i32.add)
                (export \&quot;add\&quot; (func $add))
            )&quot;;

        let expected = Module {
            types: vec![(vec![I32, I32], vec![I32])],
            funcs: vec![Func {
                f_type: 0,
                locals: vec![],
                body: vec![LocalGet(0), LocalGet(1), I32Add],
            }],
            exports: vec![Export {
                name: &quot;add&quot;.to_string(),
                e_desc: FuncExport(0),
            }],
        };

        assert_eq!(module(&amp;wat), Ok((&quot;&quot;, expected)));
    }
}</code></pre>
        </CodeBlock>

        <TextBlock>
            The <i>module_parse</i> test contains the complete Wasm code and checks if the expected AST is created from
            it by
            our parser functions. To make the parser a bit more convenient to use, let's wrap in a simple function that
            takes a Wasm module as an input and returns the corresponding AST.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">pub fn parse(wat: &amp;str) -&gt; Module {
    let (_, ast) = module::module(wat).expect(&quot;Ups, something went wrong!&quot;);
    ast
}</code></pre>
        </CodeBlock>

        <SubHeader id="whats-next">What's next?</SubHeader>

        <TextBlock>
            With the functionality implemented so far, we are now able to parse a Wasm module to an Abstract Syntax
            Tree. In the next blog post of this series, we will implement a compiler that takes the AST and encodes it
            to a binary format that a Wasm runtime can execute. You find the next <router-link
                to="/blog/wasm-compiler3">post here</router-link>.
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
