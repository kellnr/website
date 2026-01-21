<script setup lang="ts">
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import SubHeader from "@/components/elements/SubHeader.vue";
import TextBlock from "@/components/elements/TextBlock.vue";
import ImageBlock from "@/components/elements/ImageBlock.vue";
import CodeBlock from "@/components/elements/CodeBlock.vue";
</script>

<template>
    <BlogPostTemplate title="Improve Rust compile times with sccache" date="15. April, 2021">
        <SubHeader id="compile-times">Rust compile times are loooong</SubHeader>

        <TextBlock>
            Kellnr is build with Rust and we love it. One of the aspects of Rust that
            we are not too fond of are the compile times. Sure, on our developer PCs with lots or CPU cores and RAM it
            usually takes a few seconds up to a minute, but sometimes we like to code on less beefy notebooks where
            multiple minutes are the norm. A short compile time is critical to get feedback about your code. When we
            started to build Kellnr for ARM64, we decided that <a href="https://www.raspberrypi.org/">Raspberry Pi</a>
            would be a good fit to build and test on.
            The reasoning was that Raspberry Pis are immensely popular, such that it makes sense to support them from a
            business perspective, but they are also a good test to ensure that Kellnr runs on any larger ARM64 server.
            <br/>
            <br/>
            Additionally, to our Intel x64 build servers, we have a Raspberry Pi 4 cluster with multiple nodes. Building
            Kellnr takes between 30-45 minutes on such a node. As the build servers always start with a fresh clone of
            the Git repository, we cannot profit from already compiled Crates. Even if the build artifacts would be
            persistent, there is no guarantee that the next build runs on the same node and has access to the artifacts.
        </TextBlock>

        <SubHeader id="sccache">Shared Compilation Cache (sccache)</SubHeader>

        <TextBlock>
            What if we had a possibility to cache already build Crates over multiple runs and even across multiple
            servers? In that case, it does not matter that we start with a fresh Git clone or on which server the build
            takes place. That is exactly what a "Shared Compilation Cache" (<a
                href="https://github.com/mozilla/sccache">sccache</a>) does. The sccache project by
            Mozilla is a distributed compiler cache that allows a compiler to store its build artifacts in a central
            place. All other compilers on different machines than check, if there is already a compiled version of the
            Crate they need. If so, there is no need to recompile it. Cool, rustc can do that? Unfortunately, not
            directly. Instead <a href="https://doc.rust-lang.org/rustc/index.html">rustc</a> is wrapped by the sccache,
            which then pulls the compiled Crate from the cache or
            forwards the compilation request to rustc.
            <br/>
            <br/>
            Usually, if <i>cargo build</i> is invoked, the Crates that need to be compiled are handed to the rustc
            compiler
            which creates the corresponding object file from the code. These object files are stored on the
            local disk.
            A second run of <i>cargo build</i> does not need to recompile any Crate that did not change. Instead, the
            existing
            object file is used.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/sccache/rustc.png" alt="crate to objects"></ImageBlock>

        <TextBlock>
            With sccache in place, the Crates are not compiled directly, but first the cache server is checked for an
            already compiled version. If such an object file exists, it is pulled from the server instead. If such an
            object file does not exist, the Crate gets compiled by rustc and the output is then cached.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/sccache/sccache.png" alt="crate to objects"></ImageBlock>

        <TextBlock>
            The sccache server part can be on the same machine as the sccache client. In our scenario that does not make
            sense, as we want to have multiple machines to use the cache. As such, we have a different machine for the
            cache and multiple build servers can use the central cache to speed up their build times.
        </TextBlock>

        <ImageBlock src="/images/kellnr/blog/sccache/multiple-sccache.png" alt="crate to objects"></ImageBlock>

        <SubHeader id="setup-cache">Setup sccache</SubHeader>

        <TextBlock>
            We are using an Kubernetes cluster on which build servers are run as containers. Every build container
            contains a sccache client that wraps the rustc compiler. Additionally an <a
                href="https://aws.amazon.com/de/s3/">S3</a> storage runs as a container,
            which provides the central storage for the sccache server. First, lets see how the S3 storage needs to be
            configured. We are using <a href="https://min.io/">minio</a>, which provides an S3 compatible API for our
            central storage server.
        </TextBlock>

        <CodeBlock lang="yaml"># Kubernetes manifest for a minio S3 compatible storage
---
# First we are creating a persistent volume of 100Gb
# on our central storage server which is mounted on "/mnt/storageserver/minio"
# This mount point needs to be present on all cluster nodes, where minio is allowed to run.
apiVersion: v1
kind: PersistentVolume
metadata:
  name: minio-volume
spec:
  capacity:
    storage: 100Gi
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/storageserver/minio" # Needs exists before PV is created!
  persistentVolumeReclaimPolicy: Retain
---
# Create a volume claim for the volume from above.
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: minio-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: manual
  resources:
    requests:
      storage: 100Gi
---
# Deploy a minio instance which used the
# volume claim from above.
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minio
spec:
  replicas: 1
  selector:
    matchLabels:
      app: minio
  template:
    metadata:
      labels:
        app: minio
        name: minio
    spec:
      volumes:
        - name: minio-storage
          persistentVolumeClaim:
            claimName: minio-pvc
      containers:
        - name: minio
          image: minio/minio:RELEASE.2021-04-06T23-11-00Z
          args: ["server", "/data"]
          ports:
            - containerPort: 9000
          env:
            - name: MINIO_ROOT_USER
              value: root # set the name of the user
            - name: MINIO_ROOT_PASSWORD
              value: secretpwd # set the password for minio here (use secret management)
          volumeMounts:
            - name: minio-storage
              mountPath: /data
              subPath: minio
          resources:
            limits:
              memory: "256Mi"
              cpu: "500m"
            requests:
              memory: "64Mi"
              cpu: "100m"
---
# Create a service such that the web-ui
# of minio is reachable from outsite of the cluster
apiVersion: v1
kind: Service
metadata:
  name: minio
spec:
  selector:
    app: minio
  ports:
    - protocol: TCP
      port: 9000
---
# Create a route to the exported service with Traefik
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: minio
spec:
  entryPoints:
    - web
  routes:
    - match: Host(`minio.example.com`) # Add the domain on which minio is reachable
      kind: Rule
      services:
        - name: minio
          port: 9000</CodeBlock>

        <TextBlock>
            Now that we have a central storage for our compiled crates, lets configure the clients (rustc) to use the
            cache. The most interesting lines are <i>RUN $HOME/.cargo/bin/cargo install sccache</i> and <i>ADD ./config
            /home/github/.cargo/config</i>, which installs sccache and adds the configuration for cargo to use the
            cache.
        </TextBlock>

        <CodeBlock lang="docker"># Excerpt from the Dockerfile of the build server
FROM ubuntu:20.04
# ...
# Install rust
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="$HOME/.cargo/bin:${PATH}"
# Install sccache
RUN $HOME/.cargo/bin/cargo install sccache
# Add the configuration for sccache
ADD ./config $HOME/.cargo/config
# ...</CodeBlock>

        <TextBlock>
            The config file that is added to the Docker image contains the <i>rustc-wrapper</i> value with the path to
            the
            sccache binary.
        </TextBlock>

        <CodeBlock lang="toml">[build]
rustc-wrapper = "/home/user/.cargo/bin/sccache"</CodeBlock>

        <TextBlock>
            The configuration of sccache is done with environment variables.
        </TextBlock>

        <CodeBlock lang="yaml"># Kubernetes deployment for multiple build containers
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: builder
  labels:
    app: builder
spec:
  replicas: 4 # Number of instances
  selector:
    matchLabels:
      app: builder
  template:
    metadata:
      labels:
        app: builder
    spec:
      containers:
        - name: builder
          image: private.registry/builder # The image we built above
          env:
            - name: SCCACHE_BUCKET
              value: sccache
            - name: AWS_ACCESS_KEY_ID
              value: root # set the name of the user
            - name: AWS_SECRET_ACCESS_KEY
              value: secretpwd # set the password for minio here (use secret management)
            - name: SCCACHE_ENDPOINT
              value: minio.example.com:80 # set the hostname of the minio instance
          resources:
            limits:
              memory: "4Gi"
              cpu: "3500m"
            requests:
              memory: "500Mi"
              cpu: "500m"</CodeBlock>

        <TextBlock>
            That's it! If the builder container starts a build job, the rustc-wrapper will be called by cargo instead of
            rustc directly. The wrapper is set to sccache which gets its configuration from the environment variables.
            Now, each build job can access the previously build Crates.
            <br/>
            <br/>
            We cut our build times roughly in half, down to 15-20 minutes from 30-45 minutes. Why not more? The sccache
            cannot cache any Crates that depend on C libraries, as such they are build every time. The linking in the
            end is still needed for each run and takes a good portion of the total build time.
            <br/>
            <br/>
            We hope you enjoyed this post and it helps you build Rust faster!
        </TextBlock>

    </BlogPostTemplate>
</template>

<style scoped>

</style>
