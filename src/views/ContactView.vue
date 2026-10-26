<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
</script>

<template>
  <div>
    <PageHeader title="Contact" :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Contact' }]" />

    <section class="page-content">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <div class="contact-content">
              <p class="intro">
                Have a question, found a bug, or want to request a feature?
                We'd love to hear from you.
              </p>

              <div class="contact-options">
                <a href="https://github.com/kellnr/kellnr/issues" class="contact-card" target="_blank" rel="noopener">
                  <div class="contact-icon">
                    <i class="mdi mdi-github"></i>
                  </div>
                  <div class="contact-info">
                    <h3>GitHub Issues</h3>
                    <p>Report bugs, request features, or ask questions</p>
                  </div>
                  <div class="contact-arrow">
                    <i class="mdi mdi-arrow-right"></i>
                  </div>
                </a>

                <a href="https://github.com/kellnr/kellnr/discussions" class="contact-card" target="_blank" rel="noopener">
                  <div class="contact-icon">
                    <i class="mdi mdi-forum"></i>
                  </div>
                  <div class="contact-info">
                    <h3>GitHub Discussions</h3>
                    <p>Join the community and discuss ideas</p>
                  </div>
                  <div class="contact-arrow">
                    <i class="mdi mdi-arrow-right"></i>
                  </div>
                </a>

                <a href="https://github.com/sponsors/secana" class="contact-card" target="_blank" rel="noopener">
                  <div class="contact-icon">
                    <i class="mdi mdi-heart"></i>
                  </div>
                  <div class="contact-info">
                    <h3>Sponsor</h3>
                    <p>Support Kellnr's development on GitHub Sponsors</p>
                  </div>
                  <div class="contact-arrow">
                    <i class="mdi mdi-arrow-right"></i>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-content {
  padding: 1rem 0;
}

.intro {
  font-size: 1.125rem;
  color: #475569;
  text-align: center;
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

.contact-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.contact-card:hover {
  border-color: #2f55d4;
  box-shadow: 0 4px 12px rgba(47, 85, 212, 0.15);
  transform: translateX(4px);
}

.contact-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 8px;
  color: #2f55d4;
  font-size: 1.5rem;
}

.contact-card:hover .contact-icon {
  background: #2f55d4;
  color: #ffffff;
}

.contact-info {
  flex: 1;
}

.contact-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.contact-info p {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.contact-arrow {
  flex-shrink: 0;
  color: #cbd5e1;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.contact-card:hover .contact-arrow {
  color: #2f55d4;
  transform: translateX(4px);
}
</style>
