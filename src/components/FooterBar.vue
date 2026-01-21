<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <span class="brand-name">&lt;'kellnr&gt;</span>
        <span class="copyright">© 2021 - {{ new Date().getFullYear() }}</span>
      </div>

      <div class="footer-social">
        <a href="https://github.com/kellnr/kellnr" target="_blank" rel="noopener" title="GitHub">
          <i class="mdi mdi-github"></i>
        </a>
        <a href="/rss.xml" title="RSS Feed">
          <i class="mdi mdi-rss"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.copyright {
  font-size: 0.875rem;
  color: #64748b;
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #64748b;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-social a:hover {
  color: #2f55d4;
  border-color: #2f55d4;
}

.footer-social i {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-brand {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
