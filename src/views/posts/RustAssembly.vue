<script setup lang="ts">
import BlogPostTemplate from "../../components/blog/BlogPostTemplate.vue";
import TextBlock from "../../components/elements/TextBlock.vue";
import SubHeader from "../../components/elements/SubHeader.vue";
import CodeBlock from "../../components/elements/CodeBlock.vue";
</script>

<template>
    <BlogPostTemplate title="Testing Assembly Code with Rust" date="08. February, 2025">
        <TextBlock>
            This blog post is about the usage of Rust as a test runner for assembly code. You may ask, why would someone
            do that? Assembly is most likely one of the worst choices to write applications in. But sometimes, we do
            stuff just because it’s fun, not because it’s smart.
            <br />
            <br />
            After teaching years of x86 assembly to students at the university, to learn how binaries can be
            exploited, I decided to have a closer look at Arm64 assembly. I switched to a Mac when the M1 series with an
            Arm64 CPU came out, but never came around to learn about the basics of programming assembly for it.
            <br />
            <br />
            Eagerly, I wrote my first “Hello World”, added an “add” and “sub” function to get a grasp on the calling
            convention. But how do I test the functions? There is no testing framework for assembly. Fortunately, Rust
            has a great testing framework built in. So, let’s see how we can combine both to test our assembly code with
            Rust.
        </TextBlock>
        <SubHeader title="writing-some-assembly">Writing some Assembly</SubHeader>
        <TextBlock>
            First, let’s start with just assembly and keep Rust for later. As it is tradition, we start with a “Hello
            World”.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="asm">
// Assembly example code for Apple Silicon
// Shows how a dylib can be written in Assembly
// and used by Rust

// System call ABI
// X0-X2 - parameters to Unix system calls
// X16 - Mach System Call function number

// Exported symbols
.global _main // Provide program starting address to linker

.align 4 // Make sure everything is aligned properly

_main:
    // Print the "hello world" string
    mov X0, #1 // 1 = StdOut
    adr X1, helloworld // string to print
    mov X2, #13 // length of our string
    mov X16, #4 // Unix write system call
    svc #0x80 // Call kernel to output the string

    // Setup the parameters to exit the program
    // and then call the kernel to do it.
    mov X0, #0 // Use 0 return code
    mov X16, #1 // System call number 1 terminates this program
    svc #0x80 // Call kernel to terminate the program

// RO data section
helloworld: .asciz "Hello World!\n"
                </code></pre>
        </CodeBlock>
        <TextBlock>
            To compile the assembly code, we use the following Makefile. It compiles the assembly code to an object file
            and links it to an executable or a dynamic library.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="make">
exe: Asm.o
    ld -o Asm Asm.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path` -e _main -arch arm64

dylib: Asm.o
    ld -o libAsm.dylib Asm.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path` -arch arm64 -dylib

Asm.o: Asm.s
    as -arch arm64 -o Asm.o asm.s

clean:
    rm -f Asm Asm.o libAsm.dylib
                </code></pre>
        </CodeBlock>
        <TextBlock>
        Let's check if that works by executing the <i>make</i> file and checking the file type of the output.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="bash">
# Compile the assembly code to an executable
> make
# Check the file type of the output
> file ./Asm
./Asm: Mach-O 64-bit executable arm64

# Run the executable
> ./Asm
Hello World!

# Compile the assembly code to a dynamic library
> make dylib
# Check the file type of the output
> file ./libAsm.dylib
./libAsm.dylib: Mach-O 64-bit dynamically linked shared library arm64
                </code></pre>
        </CodeBlock>
        <TextBlock>
            A "Hello World" in assembly is not very exciting. Let's add a function that adds two numbers and returns the
            result. Additionally, we do the same for subtraction.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="bash">
// Assembly example code for Apple Silicon
// Shows how a dylib can be written in Assembly
// and used by Rust

// System call ABI
// X0-X2 - parameters to Unix system calls
// X16 - Mach System Call function number

// Exported symbols
.global _main // Provide program starting address to linker
.global _add
.global _sub

.align 4 // Make sure everything is aligned properly

_main:
    // Add two numbers
    mov x0, #50
    mov x1, #3
    bl _add
    // Print the result with printf
    // printf takes variadic argumetns, which are pushed on the stack
    // in reverse order. The first argument is the format string.
    str x0, [sp, #-16]! // = push x0 -> 16 byte alignment (result from add)
    adr x0, format // format string
    bl _printf
    ldr w0, [sp, #16] // = pop x0

    // Setup the parameters to exit the program
    // and then call the kernel to do it.
    mov X0, #0 // Use 0 return code
    mov X16, #1 // System call number 1 terminates this program
    svc #0x80 // Call kernel to terminate the program

// Function to add two numbers
// x0 = first number
// x1 = second number
// returns x0 + x1
_add: sub sp, sp, #16
    str x0, [sp, #8]
    str x1, [sp]

    ldr x8, [sp, #8]
    ldr x9, [sp]
    add x0, x8, x9

    add sp, sp, #16
    ret

// Function to subtract two numbers
// x0 = first number
// x1 = second number
// returns x0 - x1
_sub: sub sp, sp, #16
    str x0, [sp, #8]
    str x1, [sp]

    ldr x8, [sp, #8]
    ldr x9, [sp]
    sub x0, x8, x9

    add sp, sp, #16
    ret

// RO data section
format: .asciz "Result: %ld\n"
                </code></pre>
        </CodeBlock>
        <TextBlock>
            The assembly code now contains two functions, <i>_add</i> and <i>_sub</i>. Both functions take
            two arguments and return the result. The <i>_add</i> function adds the two arguments and the
            <i>_sub</i> function subtracts the second argument from the first one. The result is printed to the
            console using the <i>printf</i> function.
            <br />
            <br />
            You may ask why the two functions contain that much code and if a simple <i>add x0, x1; ret</i> would not be
            enough. That is true, but if we go the hard way and write assembly by hand, at least we do it slow. Fast
            code is written by the compiler. The code above is just for demonstration purposes and it shows how the
            calling convention works.
            <br />
            <br />
            A few interesting details about Arm64 assembly are that there are no push and pop instructions. Instead, the
            stack is manipulated by adding or subtracting the stack pointer. The second detail is that the stack must be
            16 byte aligned before calling a function. This is done by subtracting a multiple of 16 from the stack
            pointer before
            calling a function. This provides space for local variables, the same as in x86 code. Another thing to
            notice is that there is no return address on the stack, like in x86
            code. Instead, the return address is stored in the link register. A <i>bl</i> (branch link) instruction
            stores the return address in the link register and jumps to the target address. The <i>ret</i> instruction
            is used to return from a function and jumps to the address stored in the link register.
        </TextBlock>
        <SubHeader title="testing-assembly-with-rust">Testing Assembly with Rust</SubHeader>
        <TextBlock>
            As this is a blog post about Rust, let's see how we can test the assembly code with Rust.
            To do so, we create a Rust library and add a <i>build.rs</i> file that builds the assembly code and links it
            to the Rust library.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="rust">
use std::path::{Path, PathBuf};
use std::process::Command;
use std::{env, fs};

fn main() {
    // Tell cargo to rerun this build script if the asm.s file changed
    println!("cargo:rerun-if-changed=../libasm/asm.s");

    // Build the assembly file to a dylib
    let _output = Command::new("make")
        .arg("dylib")
        .current_dir("../libasm")
        .output()
        .expect("Failed to build dylib");

    // Copy the dylib to the target directory
    let libdir_path = PathBuf::from("../libasm")
        .canonicalize()
        .expect("cannot canonicalize library path");
    copy_dylib_to_target_dir(&libdir_path, "libAsm.dylib");

    // Link the library to the rust executable
    println!("cargo:rustc-link-search={}", env::var("OUT_DIR").unwrap());
    println!(
        "cargo:rustc-link-arg=-Wl,-rpath,{}",
        env::var("OUT_DIR").unwrap()
    );
    println!("cargo:rustc-link-lib=Asm");
}

fn copy_dylib_to_target_dir(lib_dir: &Path, dylib: &str) {
    let out_dir = env::var("OUT_DIR").unwrap();
    let dst = Path::new(&out_dir);
    let _ = fs::copy(lib_dir.join(dylib), dst.join(dylib));
}
                </code></pre>
        </CodeBlock>
        <TextBlock>
            The <i>build.rs</i> file is a build script that is executed before the Rust code is compiled. It builds the
            assembly code to a dynamic library and links it to the Rust code. The <i>copy_dylib_to_target_dir</i>
            function copies the dynamic library to the target directory, so it can be found by the Rust code. If we
            change our assembly code, we do not have to rerun the <i>make</i> command manually. Cargo will do that for
            us. We have a sweet development cycle now. We write a assembly funtion and are able to test it with <i>cargo
                test</i>.
            <br />
            <br />
            The Rust code that tests the assembly code is shown below. It contains the function definitions for the
            assembly functions, such that we can call them from Rust.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="rust">
#![allow(dead_code)]

use std::ffi::c_char;

extern "C" {
    fn sub(a: u64, b: u64) -> u64;
    fn add(a: u64, b: u64) -> u64;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        let result = unsafe { add(3, 2) };
        assert_eq!(result, 5);
    }

    #[test]
    fn test_sub() {
        let result = unsafe { sub(10, 2) };
        assert_eq!(result, 8);
    }
}
                </code></pre>
        </CodeBlock>
        <TextBlock>
        That's it. Call <i>cargo test</i> and see the assembly code being tested by Rust. But that is still quite unspectacular. Let's add a more useful function in assembly that shows how a more complex use-case can be tested with Rust.
        <br />
        <br />
        We are going to write a "to upper" function in assembly, that takes a C string and converts all characters to upper case. For that we use a sweet trick. To convert a character to upper case, we XOR 0x20 to the character. This works because the ASCII table has the lower case characters 0x61 to 0x7A and the upper case characters 0x41 to 0x5A. The difference between the lower and upper case characters is 0x20. The XOR operation toggles the 5th bit, which is the difference between lower and upper case characters.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="asm">
// Assembly example code for Apple Silicon
// Shows how a dylib can be written in Assembly
// and used by Rust

// System call ABI
// X0-X2 - parameters to Unix system calls
// X16 - Mach System Call function number

// Exported symbols
.global _main	// Provide program starting address to linker
.global _upp

.align 4	// Make sure everything is aligned properly

_main: 
	// Print the "lower" string
	mov	X0, #1		// 1 = StdOut
	adrp	X1, lower@PAGE 	// string to print
	add	X1, X1, lower@PAGEOFF
	mov	X2, #13	    	// length of our string
	mov	X16, #4		// Unix write system call
	svc	#0x80		// Call kernel to output the string

	// Convert the "lower" string to uppercase
	adrp	x0, lower@PAGE
	add	x0, x0, lower@PAGEOFF
	bl	_upp

	// Print the "lower" string
	mov	X0, #1		// 1 = StdOut
	adrp	X1, lower@PAGE	// string to print
	add	X1, X1, lower@PAGEOFF
	mov	X2, #13		// length of our string
	mov	X16, #4		// Unix write system call
	svc	#0x80		// Call kernel to output the string

	// Setup the parameters to exit the program
	// and then call the kernel to do it.
	mov     X0, #0		// Use 0 return code
	mov     X16, #1		// System call number 1 terminates this program
	svc     #0x80		// Call kernel to terminate the program

// Function to convert a string to uppercase in place
// x0 = address of string
// returns nothing
_upp:
	sub	sp, sp, #16 
	str	x0, [sp, #8]	// Address of string

	mov	x1, x0		// x1 = address of string = pointer to character
	mov	x2, xzr		// x2 = 0 = loop counter
loop:
	add	x3, x1, x2	// x3 (address of char) = x1 (address of string) + x2 (loop counter)
	ldrb	w4, [x3]	// load char into w4
	cbz	x4, end		// compare zero, if zero, branch to end

	cmp	w4, #'a'	// compare with 'a'
	blt	inc		// if less than 'a', branch to inc
	cmp	w4, #'z'	// compare with 'z'
	bgt	inc		// if greater than 'z', branch to inc

	eor	w4, w4, #32	// convert to uppercase
	strb	w4, [x3]	// store back to memory
inc:
	add	x2, x2, #1	// increment counter
	b	loop		
end:
	add	sp, sp, #16
	ret

// RW data section
.data
lower:		.asciz "hello"
        </code></pre>
        </CodeBlock>
        <TextBlock>
        The assembly code iterates over a C string and checks if the character is in the range of 'a' to 'z'. If it is, the character is converted to upper case by XORing it with 0x20. The result is stored back to memory. If we hit a '0' character, we know we've reached the end of the string, as C strings are zero terminated. Keep in mind: We change the string in place, we do not create a new string. In this economy, we have no memory to waste! That's why we need to have the string in writable memory.
        <br />
        <br />
        The Rust code that tests the assembly code is shown below. It contains the function definitions for the assembly functions, such that we can call them from Rust.
        </TextBlock>
        <CodeBlock>
            <pre v-highlightjs><code class="rust">
#![allow(dead_code)]

use std::ffi::c_char;

extern "C" {
    fn upp(str: *const c_char);
}

#[cfg(test)]
mod tests {
    use std::ffi::CString;

    use super::*;

    #[test]
    fn test_upp() {
        let c_str = CString::new("HeLlO WoRlD 123!").unwrap();
        let ptr = c_str.into_raw();

        unsafe { upp(ptr) };

        let c_str = unsafe { CString::from_raw(ptr) };
        assert_eq!(c_str.to_str().unwrap(), "HELLO WORLD 123!");
    }
}
            </code></pre>
        </CodeBlock>
        <TextBlock>
        The test function creates a C string, converts it to a raw pointer and calls the assembly function. After the function call, the raw pointer is converted back to a C string and checked if the conversion was successful. The test function is a good example of how to test assembly code with Rust. We can create complex test cases and check the results with Rust's testing framework.
        </TextBlock>
        <SubHeader title="conclusion">Conclusion</SubHeader>
        <TextBlock>
        In this blog post, we have seen how to test assembly code with Rust. We have written a few assembly functions and tested them with Rust. The development cycle is sweet. We write assembly code, build it with a Makefile, and test it with Rust. We have seen how to write a "to upper" function in assembly and how to test it with Rust. The test function creates a C string, converts it to a raw pointer, calls the assembly function, and checks if the conversion was successful. The test function is a good example of how to test assembly code with Rust. We can create complex test cases and check the results with Rust's testing framework.
        <br />
        <br />
        You find the full code on <a href="https://github.com/kellnr/blog-rust-asm/tree/main">GitHub</a>.
        </TextBlock>
        <SubHeader title="further-reading">Further Reading</SubHeader>
        <TextBlock>As usual, we stand on the shoulders of giants. Here are some resources that helped me to write this blog post:
        <br />
        <br />
        <ul>
            <li><a href="https://developer.arm.com/documentation/dui0489/i/arm-and-thumb-instructions?lang=en">Official ARM Documentation</a></li>
            <li><a href="https://github.com/zhubiaook/arm64-assembly-macos">ARM64 Assembly Examples for macOS</a></li>
            <li><a href="https://developer.apple.com/documentation/xcode/writing-arm64-code-for-apple-platforms">Writing ARM64 Code for Apple Platforms</a></li>
            <li><a href="https://diveintosystems.org/book/C9-ARM64/functions.html">Dive into Systems: ARM64 Function Calls</a></li>
            <li><a href="https://godbolt.org/">Compiler Explorer</a></li>
            <li><a href="https://duetorun.com/blog/20230615/a64-pcs-demo/#calling_convention">ARM64 Calling Convention</a></li>
            <li><a href="https://github.com/below/HelloSilicon">Hello Silicon (asm example for macOS)</a></li>
            <li><a href="https://dede.dev/posts/ARM64-Calling-Convention-Cheat-Sheet/">ARM64 Calling Convention Cheat Sheet</a></li>
        </ul>
        </TextBlock>
    </BlogPostTemplate>
</template>>
