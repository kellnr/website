<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
</script>

<template>
    <BlogPostTemplate title="Asynchronous Closures in Rust - Box and Pin" date="24. July, 2022">
        <SubHeader id="sync-closures">Synchronous closures</SubHeader>
        <TextBlock>
            In this post, we show how a synchronous closure can be converted to an asynchronous closure in Rust. There
            are several pitfalls we have to work around to make the Rust compiler happy. Unfortunately, the process is
            not straight forward and hard to tackle for Rust newbies.
        </TextBlock>
        <TextBlock>
            Let's start with a very simple program that contains only two functions. A <i>calculator</i> function that
            executes
            different mathematical operations and a <i>do_math</i> function that does the actual computation. The
            operation to
            execute is a closure, often called lambda function as well.
        </TextBlock>

        <CodeBlock>
<pre v-highlightjs><code class="rust">// Execute multiple mathematical operations by calling a function that takes
// a closure as an argument.
fn calculator() {
    // Closure that increments a value.
    let increment = |x: i64| x + 1;

    // Closure that decrements a value.
    let decrement = |x: i64| x - 1;

    // Run the closures by calling a function that takes the operation (closure) as an argument
    // and a value on which the operation is applied.
    let result = do_math(5, increment);
    assert_eq!(result, 6);
    let result = do_math(5, decrement);
    assert_eq!(result, 4);
}

// Take a closure "operation" and apply it to the value "value".
fn do_math (value: i64, operation: C) -> i64
where
    C: FnOnce(i64) -> i64,
{
    // Apply the closure to the value and return the result.
    operation(value)
} </code></pre>
        </CodeBlock>

        <TextBlock>
            Of course, we could call the closures directly in <i>calculator</i> instead of the detour through the <i>do_math</i>
            function, but imagine that the execution of an operation is an exceedingly difficult task and we do not want
            to write the boilerplate for that every time, so we wrapped that code in the <i>do_math</i> function. For
            the sake
            of readability we keep it simple here.<br/>
            <br/>
            Let's zoom in on two details of the above code.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">let increment = |x: i64| x + 1;</code></pre>
        </CodeBlock>

        <TextBlock>
            The closure is a simple operation that takes one integer of the type <i>i64</i> and returns the given value
            incremented by one. The decrement closure works the same.<br/>
            <br/>
            The second code snipped we need to look at is the function declaration of <i>do_math</i>. It takes an
            integer of
            the type <i>i64</i> and a closure of the type <i>C</i>. But what is <i>C</i>? <i>C</i> is a trait of the
            type <i><a href="https://doc.rust-lang.org/std/ops/trait.FnOnce.html">FnOnce</a></i> that takes an
            <i>i64</i>
            and returns an <i>i64</i>. We don't know what the operation does, only what it takes and what it returns. It
            can
            increment a value, decrement it, add 10 to it or do something completely different. If it is a closure that
            takes an <i>i64</i> and returns an <i>i64</i> it will work.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">fn do_math (value: i64, operation: C) -> i64
where
    C: FnOnce(i64) -> i64 </code></pre>
        </CodeBlock>

        <TextBlock>
            No async in sight so far. But now imagine that the <i>increment</i> operation takes very long, and we don't
            want to
            block the current thread, so we decide to make it async. Prepare yourself for a very unhappy Rust compiler.
        </TextBlock>

        <SubHeader id="convert-to-async">Convert the closure to async</SubHeader>

        <TextBlock>
            Converting the closures to async sounds easy. Add the <i>async</i> keyword where needed, maybe some
            <i>await</i> here and
            there, and we are done. If it was that easy, we wouldn't need a blog post explaining it, right? But let's
            start and convert the closures to async. As a first step we add the <i>async</i> keyword to our closures and
            check
            what the compiler says.
        </TextBlock>

        <TextBlock>
            Remark: A user on <a
                href="https://www.reddit.com/r/rust/comments/w6sgqu/blog_asynchronous_closures_in_rust_box_and_pin/">Reddit</a>
            pointed out that the closures are not <i>async closures</i>, but normal closures that
            return a <i>future</i>. The Rust feature for async closures is currently unstable in the language. See the
            <a href="https://github.com/rust-lang/rust/issues/62290">tracking
                issue for the feature for more</a> information.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">fn calculator() {
    let increment = |x: i64| async { x + 1 }; // add "async"
    let decrement = |x: i64| async { x - 1 }; // add "async"
    let result = do_math(5, increment);
    assert_eq!(result, 6);
    let result = do_math(5, decrement);
    assert_eq!(result, 4);
}

fn do_math (value: i64, operation: C) -> i64
where
    C: FnOnce(i64) -> i64,
{
    operation(value)
}  </code></pre>
        </CodeBlock>

        <TextBlock>If we compile the code above, we get the following complain.</TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">error[E0271]: type mismatch resolving `&lt;[closure@src/async_closures.rs:2:21: 2:45] as FnOnce&lt;(i64,)&gt;&gt;::Output == i64`
  --&gt; src/async_closures.rs:6:18
   |
2  |     let increment = |x: i64| async { x + 1 };
   |                                    --------- the found `async` block
...
6  |     let result = do_math(5, increment);
   |                  ^^^^^^^ expected `i64`, found opaque type
   |
  ::: /home/user/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/lib/rustlib/src/rust/library/core/src/future/mod.rs:72:43
   |
72 | pub const fn from_generator (gen: T) -&gt; impl Future |   ------------------------------- the found opaque type
   |
   = note: expected type `i64`
           found opaque type `impl futures::Future `
note: required by a bound in `async_closures::do_math`
  --&gt; src/async_closures.rs:15:23
   |
13 | fn do_math (value: i64, operation: C) -&gt; i64
   |    ------- required by a bound in this
14 | where
15 |     C: FnOnce(i64) -&gt; i64,
   |                       ^^^ required by this bound in `async_closures::do_math`</code></pre>
        </CodeBlock>

        <TextBlock>
            Oh boy! The error message is longer than our code! Let's dissect what the problem is. The part that helps us
            clean up the mess is the following:
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">= note: expected type `i64`
    found opaque type `impl futures::Future ` </code></pre>
        </CodeBlock>

        <TextBlock>
            The compiler hints that we changed the type of the closure from <i>|i64| -&gt; i64 to |i64| -&gt; impl
            futures::Future&lt;Output = i64&gt;</i> by adding the <i>async</i> keyword and now our <i>do_math</i>
            function can't take the closure as an argument as it still expects a <i>|i64| -&gt; i64 closure (FnOnce(i64)
            -&gt; i64)</i>.<br/>
            <br/>
            That should be easy to fix. We adjust the type <i>C</i> constraint of the <i>do_math</i> function to return
            a future. This should to the trick, as that's what the compiler is complaining about.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
where
    C: FnOnce(i64) -&gt; Future&lt;Output = i64&gt;,
{
    operation(value)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            And compile...
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">error[E0782]: trait objects must include the `dyn` keyword
  --&gt; src/async_closures.rs:17:23
   |
17 |     C: FnOnce(i64) -&gt; Future ,
   |                       ^^^^^^^^^^^^^^^^^^^^
   |
help: add `dyn` keyword before this trait
   |
17 -     C: FnOnce(i64) -&gt; Future ,
17 +     C: FnOnce(i64) -&gt; dyn Future ,
   |
 </code></pre>
        </CodeBlock>

        <TextBlock>
            That didn't seem to fix it, but instead we got another error. Fortunately, the error looks a lot less
            intimidating than the error before. The Rust compiler even tells us, how to fix the error. The error <a
                href="https://doc.rust-lang.org/error-index.html#E0782">E0782</a>
            is new in Rust 2021, before that our code would have been allowed. The error was added to indicate that we
            are working with a trait object instead of a simple heap allocated type. The <i>dyn</i> keyword makes that
            distinction explicit. So, let's add the <i>dyn</i> keyword to our code and see what happens.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
where
    C: FnOnce(i64) -&gt; dyn Future&lt;Output = i64&gt;, // add &quot;dyn&quot;
{
    operation(value)
}</code></pre>
        </CodeBlock>

        <TextBlock>
            Compiler output:
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">error[E0271]: type mismatch resolving `&lt;[closure@src/async_closures.rs:4:21: 4:45] as FnOnce&lt;(i64,)&gt;&gt;::Output == (dyn futures::Future + 'static)`
  --&gt; src/async_closures.rs:8:18
   |
4  |     let increment = |x: i64| async { x + 1 };
   |                                    --------- the found `async` block
...
8  |     let result = do_math(5, increment);
   |                  ^^^^^^^ expected trait object `dyn futures::Future`, found opaque type
   |
  ::: /home/user/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/lib/rustlib/src/rust/library/core/src/future/mod.rs:72:43
   |
72 | pub const fn from_generator (gen: T) -&gt; impl Future |  ------------------------------- the found opaque type
   |
   = note: expected trait object `(dyn futures::Future + 'static)`
               found opaque type `impl futures::Future `
note: required by a bound in `async_closures::do_math`
  --&gt; src/async_closures.rs:17:23
   |
15 | fn do_math (value: i64, operation: C) -&gt; i64
   |    ------- required by a bound in this
16 | where
17 |     C: FnOnce(i64) -&gt; dyn Future ,
   |                       ^^^^^^^^^^^^^^^^^^^^^^^^ required by this bound in `async_closures::do_math`
error[E0308]: mismatched types
  --&gt; src/async_closures.rs:19:5
   |
15 | fn do_math (value: i64, operation: C) -&gt; i64
   |                                            --- expected `i64` because of return type
...
19 |     operation(value)
   |     ^^^^^^^^^^^^^^^^ expected `i64`, found trait object `dyn futures::Future`
   |
   = note:      expected type `i64`
           found trait object `(dyn futures::Future + 'static)`</code></pre>
        </CodeBlock>

        <TextBlock>
            Ok. That got much worse than expected. Let's ignore the first error <a
                href="https://doc.rust-lang.org/error-index.html#E0271">E0271</a> for a bit and focus on <a
                href="https://doc.rust-lang.org/error-index.html#E0308">E0308</a>. The
            Rust compiler tells us that our types don't match. It expects an <i>i64</i> but got a <i>dyn
            futures::Future</i>. In
            easier words, the compiler would like to have an <i>await</i>, such that the future is unpacked and the
            content,
            the <i>i64</i>, is returned. Let's add an await and see what changes. As <i>await</i> can only be used in an
            <i>async</i>
            function, we add an <i>async</i> to the function declaration as well.<br/>
            <br/>
            Making <i>do_math async</i> forces us to make <i>calculator</i> async as well and wait the result from <i>do_math</i>
            there. The
            code with all the added async and <i>await</i> keywords looks like this:
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">use futures::Future;
async fn calculator() {
    let increment = |x: i64| async { x + 1 };
    let decrement = |x: i64| async { x - 1 };
    let result = do_math(5, increment).await;
    assert_eq!(result, 6);
    let result = do_math(5, decrement).await;
    assert_eq!(result, 4);
}
async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
where
    C: FnOnce(i64) -&gt; dyn Future&lt;Output = i64&gt;,
{
    operation(value).await
}</code></pre>
        </CodeBlock>

        <TextBlock>
            Everything is beautiful asynchronous code now. Let's compile the code again and see the code work.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">error[E0271]: type mismatch resolving `&lt;[closure@src/async_closures.rs:4:21: 4:45] as FnOnce&lt;(i64,)&gt;&gt;::Output == (dyn futures::Future&lt;Output = i64&gt; + 'static)`
  --&gt; src/async_closures.rs:8:18
   |
4  |     let increment = |x: i64| async { x + 1 };
   |                                    --------- the found `async` block
...
8  |     let result = do_math(5, increment).await;
   |                  ^^^^^^^ expected trait object `dyn futures::Future`, found opaque type
   |
  ::: /home/user/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/lib/rustlib/src/rust/library/core/src/future/mod.rs:72:43
   |
72 | pub const fn from_generator&lt;T&gt;(gen: T) -&gt; impl Future&lt;Output = T::Return&gt;
   |                                           ------------------------------- the found opaque type
   |
   = note: expected trait object `(dyn futures::Future&lt;Output = i64&gt; + 'static)`
               found opaque type `impl futures::Future&lt;Output = i64&gt;`
note: required by a bound in `async_closures::do_math`
  --&gt; src/async_closures.rs:17:23
   |
15 | async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
   |          ------- required by a bound in this
16 | where
17 |     C: FnOnce(i64) -&gt; dyn Future&lt;Output = i64&gt;,
   |                       ^^^^^^^^^^^^^^^^^^^^^^^^ required by this bound in `async_closures::do_math`
error[E0277]: the size for values of type `dyn futures::Future&lt;Output = i64&gt;` cannot be known at compilation time
  --&gt; src/async_closures.rs:19:21
   |
19 |     operation(value).await
   |     ----------------^^^^^^ doesn't have a size known at compile-time
   |     |
   |     this call returns `dyn futures::Future&lt;Output = i64&gt;`
   |
   = help: the trait `Sized` is not implemented for `dyn futures::Future&lt;Output = i64&gt;`
   = note: required because of the requirements on the impl of `std::future::IntoFuture` for `dyn futures::Future&lt;Output = i64&gt;`
help: remove the `.await`
   |
19 -     operation(value).await
19 +     operation(value)
   |</code></pre>
        </CodeBlock>

        <TextBlock>
            Oh common! What's the problem now? Luckily, the compiler error <a
                href="https://doc.rust-lang.org/error-index.html#E0277">E0277</a> states what the issue is. It says the
            <i>trait `Sized` is not implemented for `dyn futures::Future&lt;Output = i64&gt;</i>. Unfortunately, it
            doesn't tell us how we fix that issue. Do we have to implement the <i>Sized</i> trait for <i>dyn
            futures::Future&lt;...&gt;</i>? Let's try to understand the issue a bit better.
        </TextBlock>

        <TextBlock>
            The Rust compiler needs to know the size of the closures return type, but as it is <i>dyn</i> the size is
            unknown
            at compile time and only available at runtime, when a concrete type is handed to the function. One trick
            that is used a lot in Rust to get around an unknown size at compile time, is to not use the un-sized type
            directly, but use a pointer on the heap that points to the type. A heap pointer has always a known size. On
            common 64 bit CPU, the pointer size is 64 bit as well. As we are using Rust, we don't have to handcraft a
            pointer into some raw memory to point to our type. Instead we can use the <a
                href="https://doc.rust-lang.org/std/boxed/struct.Box.html#">Box</a> struct. It takes any value and
            puts it in a nice box on the heap for us. As <i>Box</i> implements the <a
                href="https://doc.rust-lang.org/std/ops/trait.Deref.html">Deref</a> trait, using it afterwards is nearly
            transparent. Let's box our return type:
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
where
    C: FnOnce(i64) -&gt; Box&lt;dyn Future&lt;Output = i64&gt;&gt;, // Add Box
{
    operation(value).await
}</code></pre>
        </CodeBlock>

        <TextBlock>
            And again, the compiler is unhappy.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">error[E0277]: `dyn futures::Future&lt;Output = i64&gt;` cannot be unpinned
  --&gt; src/async_closures.rs:19:21
   |
19 |     operation(value).await
   |     ----------------^^^^^^ the trait `Unpin` is not implemented for `dyn futures::Future&lt;Output = i64&gt;`
   |     |
   |     this call returns `dyn futures::Future&lt;Output = i64&gt;`
   |
   = note: consider using `Box::pin`
   = note: required because of the requirements on the impl of `futures::Future` for `Box&lt;dyn futures::Future&lt;Output = i64&gt;&gt;`
   = note: required because of the requirements on the impl of `std::future::IntoFuture` for `Box&lt;dyn futures::Future&lt;Output = i64&gt;&gt;`
help: remove the `.await`
   |
19 -     operation(value).await
19 +     operation(value)
   |</code></pre>
        </CodeBlock>

        <TextBlock>
            We hit one of the most difficult to understand topics in Rust: pinned memory. Going to deep into this topic
            is out of scope for this blog post but have a look at the Rust documentation for <a
                href="https://doc.rust-lang.org/std/pin/index.html">Pin</a> if you want to learn
            more. The brief summary of Pin and Unpin is that pinned memory cannot be relocated. It is fixed at a
            specific memory location. That is, for example, useful for self-referential structures. Let's fix our code:
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">use std::pin::Pin;
use futures::Future;
async fn calculator() {
    let increment = |x: i64| async { x + 1 };
    let decrement = |x: i64| async { x - 1 };
    let result = do_math(5, increment).await;
    assert_eq!(result, 6);
    let result = do_math(5, decrement).await;
    assert_eq!(result, 4);
}
async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
where
    C: FnOnce(i64) -&gt; Pin&lt;Box&lt;dyn Future&lt;Output = i64&gt;&gt;&gt;, // Add Pin
{
    operation(value).await
}</code></pre>
        </CodeBlock>

        <TextBlock>
            Fingers crossed, is the compiler happy now?
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">error[E0271]: type mismatch resolving `&lt;[closure@src/async_closures.rs:6:21: 6:45] as FnOnce&lt;(i64,)&gt;&gt;::Output == Pin&lt;Box&lt;(dyn futures::Future&lt;Output = i64&gt; + 'static)&gt;&gt;`
  --&gt; src/async_closures.rs:10:18
   |
6  |     let increment = |x: i64| async { x + 1 };
   |                                    --------- the found `async` block
...
10 |     let result = do_math(5, increment).await;
   |                  ^^^^^^^ expected struct `Pin`, found opaque type
   |
  ::: /home/user/.rustup/toolchains/stable-x86_64-unknown-linux-gnu/lib/rustlib/src/rust/library/core/src/future/mod.rs:72:43
   |
72 | pub const fn from_generator&lt;T&gt;(gen: T) -&gt; impl Future&lt;Output = T::Return&gt;
   |                                           ------------------------------- the found opaque type
   |
   = note:   expected struct `Pin&lt;Box&lt;(dyn futures::Future&lt;Output = i64&gt; + 'static)&gt;&gt;`
           found opaque type `impl futures::Future&lt;Output = i64&gt;`
note: required by a bound in `async_closures::do_math`
  --&gt; src/async_closures.rs:19:23
   |
17 | async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
   |          ------- required by a bound in this
18 | where
19 |     C: FnOnce(i64) -&gt; Pin&lt;Box&lt;dyn Future&lt;Output = i64&gt;&gt;&gt;,
   |                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ required by this bound in `async_closures::do_math`</code></pre>
        </CodeBlock>

        <TextBlock>
            Again, some types don't match. The Rust compiler knows what it expects as an argument for <i>do_math</i>,
            but our closures don't meet that requirement. They are neither boxed nor pinned. So, let's fix that.
        </TextBlock>


        <CodeBlock>
            <pre v-highlightjs><code class="rust">use std::pin::Pin;
use futures::Future;
async fn calculator() {
    let increment = |x: i64| Box::pin(async move { x + 1 }) as Pin&lt;Box&lt;dyn Future&lt;Output = i64&gt;&gt;&gt;;
    let decrement = |x: i64| Box::pin(async move { x - 1 }) as Pin&lt;Box&lt;dyn Future&lt;Output = i64&gt;&gt;&gt;;
    let result = do_math(5, increment).await;
    assert_eq!(result, 6);
    let result = do_math(5, decrement).await;
    assert_eq!(result, 4);
}
async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
where
    C: FnOnce(i64) -&gt; Pin&lt;Box&lt;dyn Future&lt;Output = i64&gt;&gt;&gt;,
{
    operation(value).await
}</code></pre>
        </CodeBlock>

        <TextBlock>
            That's it! The compiler is happy and our code works. That was much more painful than it should have been to
            be honest.
        </TextBlock>

        <SubHeader id="clean-up">Clean-up with the futures crate</SubHeader>
        <TextBlock>
            The code we wrote is far from pretty. Luckily there is a crate that helps with cleaning up the mess. The
            <a href="https://crates.io/crates/futures">futures</a> crate provides the functionality we coded manually
            wrapped in nice types. We use the <i>boxed()</i>
            function to clean up our closures and the <i>BoxFuture</i> type to clean up our <i>do_math</i> function.
            After applying
            the syntactic sugar, our program looks like this:
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">use futures::{future::BoxFuture, FutureExt};
async fn calculator() {
    let increment = |x: i64| async move { x + 1 }.boxed(); // Use boxed()
    let decrement = |x: i64| async move { x - 1 }.boxed(); // Use boxed()
    let result = do_math(5, increment).await;
    assert_eq!(result, 6);
    let result = do_math(5, decrement).await;
    assert_eq!(result, 4);
}
async fn do_math&lt;C&gt;(value: i64, operation: C) -&gt; i64
where
    C: FnOnce(i64) -&gt; BoxFuture&lt;'static, i64&gt;, // Use BoxFuture
{
    operation(value).await
}</code></pre>
        </CodeBlock>

        <TextBlock>
            That looks much cleaner than before. If you compare this version with our initial synchronous code, the
            difference isn't that big anymore.
        </TextBlock>

        <SubHeader id="simpler-solution">An even simpler solution</SubHeader>
        <TextBlock>
            A reader on <a
                href="https://www.reddit.com/r/rust/comments/w6sgqu/blog_asynchronous_closures_in_rust_box_and_pin/">Reddit</a>
            pointed out that for this very simple piece of code, there is another solution, which is even cleaner. Keep
            in mind that in a more complex setup, this may not work.
        </TextBlock>

        <CodeBlock>
            <pre v-highlightjs><code class="rust">use std::future::Future;
async fn calculator() {
    let increment = |x: i64| async move { x + 1 };
    let decrement = |x: i64| async move { x - 1 };
    let result = do_math(5, increment).await;
    assert_eq!(result, 6);
    let result = do_math(5, decrement).await;
    assert_eq!(result, 4);
}
async fn do_math&lt;F, C&gt;(value: i64, operation: C) -&gt; i64
where
    F: Future&lt;Output = i64&gt;,
    C: FnOnce(i64) -&gt; F,
{
    operation(value).await
}</code></pre>
        </CodeBlock>

        <TextBlock>
            As we cannot return a trait directly, we used <i>dyn Trait</i>, which is a type. Another solution is to
            introduce a
            generic over a type that is constrained with a trait bound. In our case <i>F</i> is introduced, which is
            used as
            the return type from <i>C</i>. <i>F</i> is constrained to implement <i>Future&lt;Output = i64&gt;</i>. This
            works, as we don't
            return a trait, but instead a generic type that has to implement that trait.
        </TextBlock>

        <SubHeader id="conclusion">Conclusion</SubHeader>
        <TextBlock>
            It is very well possible to write clean asynchronous code with closures in Rust. The problem is that the
            compiler errors are getting much less helpful as soon as we enter the async-territory. It is our challenge
            as the Rust community, to improve the async aera of the language, such that new Rust programmers aren't
            overwhelmed with strange error messages for a seemingly small change.<br/>
            <br/>
            If you have ideas to improve the code above or found some error, let us know!<br/>
            <br/>
            All code can from this post can be found on: <a href="https://github.com/kellnr/blog-async-closures">Github</a>
        </TextBlock>
    </BlogPostTemplate>
</template>

<style scoped>

</style>
