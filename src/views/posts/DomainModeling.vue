<script setup lang="ts">
import BlogPostTemplate from "../../components/blog/BlogPostTemplate.vue";
import TextBlock from "../../components/elements/TextBlock.vue";
import SubHeader from "../../components/elements/SubHeader.vue";
import CodeBlock from "../../components/elements/CodeBlock.vue";
</script>

<template>
  <BlogPostTemplate title="Leveraging the Type System for Domain Modeling in Rust" date="15. June, 2023">
    <TextBlock>
      Today, we want to discuss how we can utilize Rust's type system to accurately model the domain of our application.
    </TextBlock>

    <SubHeader id="example-scenario">Example Scenario</SubHeader>
    <TextBlock>
      Let's consider the scenario of building a backend for a web application. One of the essential features is user
      registration and login. To register, users need to provide their name, age, and email address. Initially, we can
      write a naive function to handle this:
    </TextBlock>
    <CodeBlock lang="rust">
pub fn register_user(name: &amp;str, age: i32, email: &amp;str) {
    // Perform user registration...
}
    </CodeBlock>
    <TextBlock>
      For now, let's focus on the function signature rather than its implementation. The function takes a name, age,
      and an email address as parameters, where the name is a <i>string</i>, the age is an <i>integer</i>, and the email
      address is
      also a <i>string</i>. This approach is common in many programming languages, where primitive types are used to
      represent
      domain concepts. However, this simplistic approach fails to truly model the complexities of our domain.
      <br/>
      <br/>
      Let's start by examining the name parameter.
    </TextBlock>

    <SubHeader id="name">Name Validation</SubHeader>
    <TextBlock>
      Is a name simply an arbitrary string? What about its length? Can it contain special characters or numbers? To
      illustrate the concept, let's assume a simplified European naming scheme:

      <ul>
        <li>A name consists of a forename and a surname.</li>
        <li>Each part is between two and twenty characters long.</li>
        <li>Only alphabetic characters are allowed in both parts.</li>
      </ul>
      To incorporate these validations, we can enhance our <i>register_user</i> function as follows:
    </TextBlock>
    <CodeBlock lang="rust">
pub fn register_user(name: &amp;str, age: i32, email: &amp;str) {
    let forename = &amp;name[..name.find(' ').unwrap()];
    let surname = &amp;name[name.find(' ').unwrap() + 1..];

    if forename.len() &lt; 2 || forename.len() &gt; 20 {
        eprintln!("Forename is too short or too long");
        return;
    }

    if surname.len() &lt; 2 || surname.len() &gt; 20 {
        eprintln!("Surname is too short or too long");
        return;
    }

    if forename.chars().any(|c| !c.is_alphabetic()) {
        eprintln!("Forename contains non-alphabetic characters");
        return;
    }

    if surname.chars().any(|c| !c.is_alphabetic()) {
        eprintln!("Surname contains non-alphabetic characters");
        return;
    }

    // Perform user registration...
}
    </CodeBlock>
    <TextBlock>
      Although this implementation may seem acceptable, it suffers from several issues:

      <ol>
        <li><strong>Separation of concerns</strong>: The <i>register_user</i> function is now responsible for validating the
          name, which is not
          its primary job. It should focus solely on user registration.
        </li>
        <li><strong>Code duplication</strong>: We have duplicated the validation checks for both the forename and the
          surname. This not
          only becomes tedious but also prone to errors.
        </li>
        <li><strong>Reusability</strong>: What if we have another function, such as <i>register_user_from_partner</i>, that
          also requires a
          name?
          We would need to duplicate the same validation logic again.
        </li>
        <li><strong>Testability</strong>: How can we test the validation logic independently? We would have to call the
          <i>register_user</i>
          function with various names and check if the validation behaves as expected.
        </li>
      </ol>
      Fortunately, we can employ the type system to address these issues. Instead of treating a name as a generic
      string, we can create a dedicated type for it.
    </TextBlock>
    <CodeBlock lang="rust">
// A name with clear division between forename and surname
pub struct Name {
    forename: String,
    surname: String,
}

// Implement the TryFrom trait to convert a tuple of strings into a name
impl TryFrom&lt;(&amp;str, &amp;str)&gt; for Name {
    type Error = &amp;'static str;

    fn try_from(value: (&amp;str, &amp;str)) -&gt; Result&lt;Self, Self::Error&gt; {
        Ok(Self {
            forename: Self::validate_name(value.0)?.to_owned(),
            surname: Self::validate_name(value.1)?.to_owned(),
        })
    }
}

// Implement the checks for the type used by the TryFrom trait
impl Name {
    fn validate_name(name: &amp;str) -&gt; Result&lt;&amp;str, &amp;'static str&gt; {
        Self::validate_length(name).and_then(Self::validate_char_set)
    }

    fn validate_length(name: &amp;str) -&gt; Result&lt;&amp;str, &amp;'static str&gt; {
        if name.len() &lt; 2 {
            Err("Name too short")
        } else if name.len() &gt; 20 {
            Err("Name too long")
        } else {
            Ok(name)
        }
    }

    fn validate_char_set(name: &amp;str) -&gt; Result&lt;&amp;str, &amp;'static str&gt; {
        if name.chars().any(|c| !c.is_alphabetic()) {
            Err("Name contains non alphabetic characters")
        } else {
            Ok(name)
        }
    }
}
    </CodeBlock>
    <TextBlock>
      In the code above, we've introduced a new <i>Name</i> struct with <i>forename</i> and <i>surname</i> fields. We've
      also implemented the
      <a href="https://doc.rust-lang.org/std/convert/trait.TryFrom.html">TryFrom trait</a>, allowing us to convert a
      tuple of strings into a
      <i>Name</i> instance. The <i>TryFrom</i> trait provides a more
      explicit conversion mechanism that allows us to handle potential errors during the conversion process.

      With this new implementation, our <i>register_user</i> function can be updated to accept a <i>Name</i> instance
      instead of a
      generic string:
    </TextBlock>
    <CodeBlock lang="rust">
pub fn register_user(name: Name, age: i32, email: &amp;str) {
    // Perform user registration...
}
    </CodeBlock>
    <TextBlock>
      By making this change, we've achieved several benefits:

      <ol>
        <li><strong>Separation of concerns</strong>: The name validation logic is now encapsulated within the TryFrom
          implementation for
          <i>Name</i>, keeping the <i>register_user</i> function focused on its primary task.
        </li>
        <li><strong>Code duplication</strong>: No more code duplication, we can use the same logic for the fore- and
          surname.
        </li>
        <li><strong>Reusability</strong>: We can reuse the Name type and its validation logic across multiple functions
          that require name
          input, ensuring consistency and reducing code duplication.
        </li>
        <li><strong>Testability</strong>: The validation logic for names can be tested independently by creating Name
          instances and asserting
          that the conversion succeeds or fails as expected.
        </li>
      </ol>

      Let's write some non exhaustive tests for the <i>Name</i> type.
    </TextBlock>
    <CodeBlock lang="rust">
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_name() {
        assert!(Name::try_from(("Forename", "Surname")).is_ok());
    }

    #[test]
    fn invalid_forename_to_short() {
        assert!(Name::try_from(("", "Surname")).is_err());
    }

    #[test]
    fn invalid_surname_to_short() {
        assert!(Name::try_from(("Forename", "S")).is_err());
    }

    #[test]
    fn invalid_surname_too_long() {
        assert!(Name::try_from(("Forename", "SurnameSurnameSurnameSurname")).is_err());
    }

    #[test]
    fn invalid_forename_too_long() {
        assert!(Name::try_from(("ForenameForenameForenameForename", "Surname")).is_err());
    }

    #[test]
    fn invalid_forename_contains_non_alphabetic_characters() {
        assert!(Name::try_from(("Forename1", "Surname")).is_err());
    }

    #[test]
    fn invalid_surname_contains_non_alphabetic_characters() {
        assert!(Name::try_from(("Forename", "Surname1")).is_err());
    }
}
    </CodeBlock>
    <TextBlock>
      If we need to have more or less restrictions in the future, they are easy to add or remove and we can test them in
      isolation.
    </TextBlock>

    <SubHeader id="age">Age Validation</SubHeader>
    <TextBlock>
      As you may have noticed, we have not yet implemented age validation. The age parameter shares similar issues as
      the name parameter, and a few additional ones. For instance, it can be negative since an i32 can hold negative
      values. Furthermore, if we simply save the age as an integer, it will become incorrect in the following year.
      <br/>
      <br/>
      Let's define the requirements for our age property. In order to use our service, the age must be between 18 and
      130 years. Additionally, the age needs to be stored in a way that remains up-to-date, meaning it increases
      automatically every year.
      <br/>
      <br/>
      Here's an improved implementation using a <i>DateTime</i> to store the age:
    </TextBlock>
    <CodeBlock lang="rust">
pub struct Age {
    birth_date: DateTime&lt;Utc&gt;,
}

impl TryFrom&lt;DateTime&lt;Utc&gt;&gt; for Age {
    type Error = &amp;'static str;

    fn try_from(value: DateTime&lt;Utc&gt;) -&gt; Result&lt;Self, Self::Error&gt; {
        let now = Utc::now();
        let age = now.years_since(value).ok_or("Invalid date")?;

        if age &lt; 18 || age &gt; 130 {
            Err("Age must be greater than 18 years old and less or equal to 130 years old")
        } else {
            Ok(Age { birth_date: value })
        }
    }
}
    </CodeBlock>
    <TextBlock>
      Using a <i>DateTime</i> allows us to calculate the age whenever it is needed, ensuring it remains accurate over
      time.
      <br/>
      <br/>
      Let's also include some tests to validate our implementation:
    </TextBlock>
    <CodeBlock lang="rust">
#[cfg(test)]
mod tests {
    use super::*;
    use chrono::TimeZone;

    #[test]
    fn valid_age() {
        let birth_date = Utc.with_ymd_and_hms(1990, 1, 1, 0, 0, 0).unwrap();
        assert!(Age::try_from(birth_date).is_ok());
    }

    #[test]
    fn invalid_age_too_young() {
        let birth_date = Utc.with_ymd_and_hms(2010, 1, 1, 0, 0, 0).unwrap();
        assert!(Age::try_from(birth_date).is_err());
    }

    #[test]
    fn invalid_age_too_old() {
        let birth_date = Utc.with_ymd_and_hms(1800, 1, 1, 0, 0, 0).unwrap();
        assert!(Age::try_from(birth_date).is_err());
    }
}
    </CodeBlock>
    <TextBlock>
      These tests cover valid and invalid age scenarios.
      <br/>
      <br/>
      Finally, we can refactor the <i>register_user</i> function to utilize the <i>Age</i> type:
    </TextBlock>
    <CodeBlock lang="rust">
pub fn register_user(name: Name, age: Age, email: &amp;str) {
    // Perform user registration...
}
    </CodeBlock>
    <TextBlock>
      By incorporating the <i>Age</i> type, we ensure that only valid ages are accepted during user registration.
    </TextBlock>

    <SubHeader id="email">Email Validation</SubHeader>
    <TextBlock>
      Validating email addresses is an important step in ensuring data integrity. Similar to validating the Name or Age
      fields, we can create a dedicated type for email and implement the TryFrom trait for it. To accomplish this, we'll
      use the regex crate for pattern matching.
    </TextBlock>
    <CodeBlock lang="rust">
use regex::Regex;

pub struct Email {
    email: String,
}

impl TryFrom&lt;&amp;str&gt; for Email {
    type Error = &amp;'static str;

    fn try_from(value: &amp;str) -&gt; Result&lt;Self, Self::Error&gt; {
        // Note that this is not a 100% correct regex for email validation but it's good enough for this example
        let email_regex = Regex::new(r"^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)")
            .unwrap(); // Safe to unwrap as the regex is static and correct
        match email_regex.is_match(value) {
            true =&gt; Ok(Self { email: value.to_owned() }),
            false =&gt; Err("Invalid email"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn valid_email() {
        assert!(Email::try_from("foo.bar@foobar.com",).is_ok());
    }

    #[test]
    fn invalid_email_no_post_part() {
        assert!(Email::try_from("a@").is_err());
    }

    #[test]
    fn invalid_email_no_domain() {
        assert!(Email::try_from("a@aaaaaaaaaaaaaaaaaaaaaaaaaaa").is_err());
    }

    #[test]
    fn invalid_email_invalid_char() {
        assert!(Email::try_from("fUeoe@foobar.com").is_err());
    }
}
    </CodeBlock>
    <TextBlock>
      To validate the email, we can now leverage this <i>Email</i> type. Here's an updated version of the <i>register_user</i>
      function that uses the
      <i>Email</i> type as a parameter:
    </TextBlock>
    <CodeBlock lang="rust">
pub fn register_user(name: Name, age: Age, email: Email) {
    // Perform user registration...
}
    </CodeBlock>
    <TextBlock>
      By separating the validation logic into the <i>Email</i> type, the code reads more clearly and improves
      maintainability. However, we should consider the implications of introducing these new types.
    </TextBlock>

    <SubHeader id="everything-fine">Everything fine now?</SubHeader>
    <TextBlock>
      While we addressed the previous issues, we also introduced new challenges. Changing the types from primitives to
      structs may potentially break existing code that relies on these data types. This becomes especially problematic
      in large codebases with millions of lines of code, where refactoring every code segment that utilizes the
      registration data becomes an arduous task. Additionally, external libraries often accept only primitive types as
      parameters, making it impossible to use our new types with them.
      <br/>
      <br/>
      To tackle this situation, we have a couple of options:
      <br/>
      <br/>
      <ol>
        <li>Refactor as much code as possible to utilize our new types. However, this approach requires significant
          effort and
          may not always be feasible.
        </li>
        <li>Apply our new types at the application's boundary.</li>
      </ol>
      By enforcing validation at the application's edge, we cannot change the behavior of external libraries, but we can
      ensure that only valid data enters the application. This allows us to employ our new types internally, providing
      data integrity.
      <br/>
      <br/>
      In our example, we can achieve this by formatting our types as primitive types before interacting with external
      code, such as a database library.
    </TextBlock>

    <TextBlock>
      We can't change the database library to use our new types. But we can make sure that only valid data can enter the
      application. This way we can use our new types inside the application and we can be sure that the data is valid.
      <br/>
      <br/>
      In our simple example we this could look like the following:
    </TextBlock>
    <CodeBlock lang="rust">
pub fn register_user(name: Name, age: Age, email: Email) {
    // Do the registration...

    // Format our types as primitive types
    db.insert_user(name.to_string(), age.to_rfc3339(), email.to_string());
}
    </CodeBlock>
    <TextBlock>
      This approach offers two advantages. First, we can utilize our new types within the application while interacting
      seamlessly with existing and external code. Second, we can easily normalize data. For instance, email addresses
      are case-insensitive, but it's preferable to store them in lowercase. By returning a lowercase version in the
      <i>to_string</i> function of our <i>Email</i> type, we guarantee consistent lowercase email addresses. Similarly, we can ensure
      that the <i>Age</i> type's primitive representation adheres to a specific format, such as RFC3339.
      <br/>
      <br/>
      By pushing validation to the edge of the application, we strike a balance between data integrity and compatibility
      with external components.
    </TextBlock>

    <SubHeader id="conclusion">Conclusion</SubHeader>
    <TextBlock>
      We started with a simple function that takes some parameters and does some validation on them. We refactored the
      validation to use struct types instead of primitive types. This way we can guarantee that the data is valid and we
      can
      use the data in a safe way inside the application. We also saw that this approach can be problematic if we have a
      lot of code that uses the data. In this case we can push the validation to the edge of the application and make
      sure that only valid data can enter the application.
      <br/>
      <br/>
      In addition to the name validation example, leveraging Rust's type system for domain modeling provides various
      other advantages:
      <br/>
      <br/>
      <ul>
        <li><strong>Improved correctness</strong>: By defining domain-specific types, we can ensure that only valid
          values conforming to the
          domain rules are used. This reduces the likelihood of runtime errors and improves overall correctness.
        </li>
        <li><strong>Enhanced expressiveness</strong>: Types can communicate the intent and meaning of values in our
          code, making it more
          self-explanatory and easier to understand for both developers and maintainers.
        </li>
        <li><strong>Enforced constraints</strong>: The type system can enforce constraints and invariants of our domain,
          preventing invalid
          states and catching errors at compile-time rather than runtime.
        </li>
        <li><strong>Compile-time guarantees</strong>: With a well-designed domain model, the type system can catch many
          common mistakes and
          prevent certain classes of bugs, providing early feedback during development.
        </li>
      </ul>

      In conclusion, leveraging the type system for domain modeling in Rust empowers us to build more robust,
      expressive, and maintainable applications. By creating dedicated types that accurately represent the domain
      concepts and incorporating validation logic within those types, we can achieve greater correctness, reusability,
      and testability in our codebase.
      <br/>
      <br/>
      Happy coding in Rust!
    </TextBlock>

    <SubHeader id="further-reading">Further Reading</SubHeader>
    <TextBlock>
      If you find the idea of proper domain modeling appealing, check out the book "Domain Modeling made Functional" by
      Scott Wlaschin. It's a great book that explains the concepts of domain modeling in a very understandable way.
      While it is written in F#, the concepts are applicable to any language and are easy to translate to Rust. It is
      one of the must-read books, I recommend to every developer.
    </TextBlock>
  </BlogPostTemplate>
</template>

<style scoped>

</style>
