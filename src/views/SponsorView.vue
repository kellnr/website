<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import { SPONSOR_URL, costs, pastSponsors, sponsors } from "@/data/sponsoring";

const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);

const euros = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const sponsorGroups = [
  { title: "Current sponsors", sponsors },
  { title: "Past sponsors", sponsors: pastSponsors },
];

const fundedWork = [
  {
    icon: "mdi-shield-check",
    title: "Security fixes and releases",
    text: "Dependency updates, security patches and regular releases, also for the boring parts.",
  },
  {
    icon: "mdi-forum",
    title: "Answers to issues",
    text: "Time to look into bug reports, review pull requests and help with tricky setups.",
  },
  {
    icon: "mdi-cloud-outline",
    title: "Infrastructure",
    text: "The website, the documentation and everything needed to build and ship Kellnr.",
  },
];

const otherWays = [
  {
    icon: "mdi-star",
    text: "Star Kellnr on GitHub",
    href: "https://github.com/kellnr/kellnr",
  },
  {
    icon: "mdi-source-pull",
    text: "Contribute code or docs",
    href: "https://github.com/kellnr/kellnr/blob/main/CONTRIBUTING.md",
  },
  {
    icon: "mdi-bullhorn",
    text: "Tell others how you use Kellnr",
    href: "https://github.com/kellnr/kellnr/discussions",
  },
];
</script>

<template>
  <div>
    <PageHeader
      title="Sponsor Kellnr"
      subtitle="Kellnr is free, open source and maintained by one person in their spare time. Sponsoring keeps it that way."
      :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Sponsor' }]"
    />

    <section class="page-content">
      <div class="container">
        <div class="sponsor-page">
          <div class="intro">
            <p>
              Kellnr started in 2021 as a side project and has grown into a registry that companies run in production.
              Behind it is still a single developer. I work on it in my spare time and pay the running costs out of my own
              pocket.
            </p>
            <p>
              If Kellnr saves you or your team time, please consider giving something back. Monthly and one-time
              sponsorships are both welcome.
            </p>
            <a :href="SPONSOR_URL" class="btn-sponsor" target="_blank" rel="noopener">
              <i class="mdi mdi-heart" aria-hidden="true"></i>
              Sponsor on GitHub
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <h2 class="section-title">What Kellnr costs</h2>
          <p class="section-text">The yearly out-of-pocket costs, not counting the time that goes into it.</p>
          <table class="cost-table">
            <tbody>
              <tr v-for="cost in costs" :key="cost.item">
                <td class="cost-icon"><i class="mdi" :class="cost.icon" aria-hidden="true"></i></td>
                <td>
                  <span class="cost-item">{{ cost.item }}</span>
                  <span class="cost-note">{{ cost.note }}</span>
                </td>
                <td class="cost-amount">{{ euros.format(cost.amount) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <th scope="row">Per year</th>
                <td class="cost-amount">{{ euros.format(totalCosts) }}</td>
              </tr>
            </tfoot>
          </table>
          <p class="cost-time">
            <i class="mdi mdi-clock-outline" aria-hidden="true"></i>
            On top of that, Kellnr takes 130 to 260 hours of my spare time every year, more than 1,500 hours since 2021.
          </p>

          <h2 class="section-title">What your sponsorship pays for</h2>
          <ul class="card-list">
            <li v-for="work in fundedWork" :key="work.title" class="card">
              <span class="card-icon"><i class="mdi" :class="work.icon" aria-hidden="true"></i></span>
              <span class="card-title">{{ work.title }}</span>
              <span class="card-text">{{ work.text }}</span>
            </li>
          </ul>

          <div class="companies">
            <h2 class="section-title">Does your company use Kellnr?</h2>
            <p>
              Sponsor from your company's GitHub organization. It is billed to the organization's GitHub account, so
              there is no contract or extra vendor to set up. A good rule of thumb: what one hour of an engineer's time
              costs, once a month.
            </p>
            <a :href="SPONSOR_URL" class="link-arrow" target="_blank" rel="noopener">
              Sponsor as an organization
              <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <h2 class="section-title">Thank you</h2>
          <p class="section-text">
            These people and organizations sponsor or have sponsored Kellnr, monthly or once. Thank you for your
            support!
          </p>
          <div class="sponsor-groups">
            <template v-for="group in sponsorGroups" :key="group.title">
              <h3 v-if="group.sponsors.length" class="sponsor-group-title">{{ group.title }}</h3>
              <ul v-if="group.sponsors.length" class="sponsor-list">
                <li v-for="sponsor in group.sponsors" :key="sponsor.login">
                  <a :href="`https://github.com/${sponsor.login}`" class="sponsor" target="_blank" rel="noopener">
                    <img
                      :src="`https://github.com/${sponsor.login}.png?size=96`"
                      alt=""
                      width="48"
                      height="48"
                      loading="lazy"
                    />
                    {{ sponsor.login }}
                  </a>
                </li>
              </ul>
            </template>
          </div>

          <h2 class="section-title">Other ways to help</h2>
          <ul class="other-list">
            <li v-for="way in otherWays" :key="way.text">
              <a :href="way.href" class="other" target="_blank" rel="noopener">
                <i class="mdi" :class="way.icon" aria-hidden="true"></i>
                {{ way.text }}
                <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sponsor-page {
  max-width: 820px;
  margin: 0 auto;
}

/* Intro */
.intro {
  margin-bottom: 3rem;
  font-size: 1.1rem;
  color: #334155;
}

.btn-sponsor {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-weight: 600;
  color: #ffffff;
  background: #db2777;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(219, 39, 119, 0.3);
  transition: all 0.2s ease;
}

.btn-sponsor:hover {
  color: #ffffff;
  background: #be185d;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(219, 39, 119, 0.4);
}

/* Sections */
.section-title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.section-text {
  margin: 0 0 1rem;
  color: #475569;
}

/* Costs */
.cost-table {
  width: 100%;
  margin-bottom: 1.5rem;
  border-collapse: collapse;
}

.cost-table td,
.cost-table th {
  padding: 0.875rem 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.cost-icon {
  width: 2.5rem;
  font-size: 1.375rem;
  color: #2f55d4;
}

.cost-item {
  display: block;
  font-weight: 700;
  color: #0f172a;
}

.cost-note {
  display: block;
  font-size: 0.9rem;
  color: #64748b;
}

.cost-amount {
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
  color: #0f172a;
}

.cost-table tfoot th,
.cost-table tfoot td {
  border-bottom: 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: left;
}

.cost-table tfoot .cost-amount {
  text-align: right;
  color: #db2777;
}

.cost-time {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  margin: 0 0 3rem;
  padding: 1rem 1.25rem;
  color: #334155;
  background: #fdf2f8;
  border-radius: 12px;
}

.cost-time i {
  font-size: 1.25rem;
  color: #db2777;
}

/* Funded work */
.card-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0 3rem;
  padding: 0;
  list-style: none;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 0.5rem;
  font-size: 1.375rem;
  color: #2f55d4;
  background: #eff6ff;
  border-radius: 10px;
}

.card-title {
  font-weight: 700;
  color: #0f172a;
}

.card-text {
  color: #475569;
  line-height: 1.6;
}

/* Companies */
.companies {
  padding: 1.5rem;
  margin-bottom: 3rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.companies p {
  color: #475569;
}

.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: gap 0.2s ease;
}

.link-arrow:hover {
  gap: 0.75rem;
}

/* Sponsors */
.sponsor-groups {
  margin-bottom: 3rem;
}

.sponsor-group-title {
  margin: 1.5rem 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
}

.sponsor-group-title:first-child {
  margin-top: 0.5rem;
}

.sponsor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sponsor {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 1rem 0.375rem 0.375rem;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.sponsor img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.sponsor:hover {
  color: #db2777;
  border-color: #db2777;
}

/* Other ways to help */
.other-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.other {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.other i {
  font-size: 1.25rem;
  color: #2f55d4;
}

.other:hover {
  color: #2f55d4;
  border-color: #2f55d4;
}

/* Keyboard focus */
.btn-sponsor:focus-visible,
.link-arrow:focus-visible,
.sponsor:focus-visible,
.other:focus-visible {
  outline: 3px solid rgba(47, 85, 212, 0.5);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .btn-sponsor,
  .link-arrow,
  .sponsor,
  .other {
    transition: none;
  }
}

@media (max-width: 768px) {
  .card-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .other-list li {
    flex: 1 1 100%;
  }

  .other {
    width: 100%;
  }
}
</style>
