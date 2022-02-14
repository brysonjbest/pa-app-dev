<template>
  <div>
    <b-jumbotron header='Welcome' lead="Premier's Awards Nominations" />

    <b-container class="mb-2" v-if='isNominator'>
      <b-row>
        <b-col>You are logged in as <b>{{user.username}}</b></b-col>
        <b-col class="text-right">Nomination Year: {{settings.year}}</b-col>
      </b-row>
    </b-container>
    <b-container class="mb-2" v-else>
      <p>This nomination tool is restricted to authorized nominators. To request access, please register as a
      nominator.</p>
      <b-button
        block
        variant="info"
        @click="reroute(`/register`)">
        Nominator Registration
      </b-button>
    </b-container>

    <b-container v-if="isNominator">
      <div>
      <b-card-group deck>
        <b-card title="Emerging Leader">
          <b-card-text>
            This award recognizes a BC Public Service employee 40 years and under and at or below the level of director who has made a significant impact in their ministry, division, workgroup or the greater BC Public Service early in their career.
          </b-card-text>
          <template #footer>
            <b-button
              block variant="info"
              @click="reroute(`/create/${settings.year}/emerging-leader/`)">
              Nominate: Emerging Leader
            </b-button>
          </template>
        </b-card>
        <b-card title="Evidence-based Design">
          <b-card-text>
            This award recognizes groups, teams or organizations in the BC Public Service whose work is outstanding in the area of evidence-based or evidence-informed policy or program development, and the process by which the policy or program was designed. This category showcases excellence in policy or program development for internal government or citizen-facing initiatives.
          </b-card-text>
          <template #footer>
            <b-button
              block variant="info"
              @click="reroute(`/create/${settings.year}/evidence-based-design`)"
            >
              Nominate: Evidence-Based Design
            </b-button>
          </template>
        </b-card>

        <b-card title="Innovation">
          <b-card-text>
            This award recognizes groups, teams or organizations in the BC Public Service who have developed and transformed new ideas into tangible initiatives, programs or projects. By applying a user-centric or citizen-centric approach, innovations streamline business processes, leverage technology or pursue creative solutions to fulfill organizational mandates.
          </b-card-text>
          <template #footer>
            <b-button
              block
              variant="info"
              @click="reroute(`/create/${settings.year}/innovation`)">
              Nominate: Innovation
            </b-button>
          </template>
        </b-card>

        </b-card-group>
      </div>
      <div class="mt-3">
        <b-card-group deck class="mb-3">

          <b-card title="Leadership">
            <b-card-text>
              This award recognizes a BC Public Service employee who demonstrates the highest levels of integrity and exemplary leadership abilities either leading a team or organization, or a substantial project, process or initiative.
            </b-card-text>
            <template #footer>
              <b-button
                block
                variant="info"
                @click="reroute(`/create/${settings.year}/leadership`)"
              >
                Nominate: Leadership
              </b-button>
            </template>
          </b-card>

          <b-card title="Legacy">
            <b-card-text>
              This award recognizes individuals who have made exceptional and lasting contributions to the BC Public Service and/or the province during a public service career of at least 15 years. The contributions may cover a nominee’s entire career or portions of it, provided the contribution has a lasting and ongoing positive impact.
            </b-card-text>
            <template #footer>
              <b-button
                block
                variant="info"
                @click="reroute(`/create/${settings.year}/legacy`)"
              >
                Nominate: Legacy
              </b-button>
            </template>
          </b-card>

          <b-card title="Organizational Excellence">
            <b-card-text>
              This award recognizes one or more BC Public Service organizations that have delivered a program, service or initiative resulting in substantial benefits to their organization(s), the public service or citizens.
            </b-card-text>
            <template #footer>
              <b-button
                block
                variant="info"
                @click="reroute(`/create/${settings.year}/organizational-excellence`)">
                Nominate: Organizational Excellence
              </b-button>
            </template>
          </b-card>

        </b-card-group>
      </div>
      <div class="mt-3">
        <b-card-group deck class="mb-3">

          <b-card title="Partnership">
            <b-card-text>
              This award recognizes joint ventures or multi-party initiatives between BC Public Service organizations and organizations in the broader public sector, other levels of government, Indigenous communities or in the private or non-profit sectors.
            </b-card-text>
            <template #footer>
              <b-button
                block
                variant="info"
                @click="reroute(`/create/${settings.year}/partnership`)">
                Nominate: Partnership
              </b-button>
            </template>
          </b-card>

          <b-card title="Regional Impact">
            <b-card-text>
              This award recognizes groups, teams or organizations within the BC Public Service who have developed and delivered programs, projects and initiatives benefiting citizens in a specific location (town, city, municipality or region).
            </b-card-text>
            <template #footer>
              <b-button
                block
                variant="info"
                @click="reroute(`/create/${settings.year}/regional-impact`)">
                Nominate: Regional Impact
              </b-button>
            </template>
          </b-card>
      </b-card-group>
    </div>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'Home',
  computed : {
    isLoggedIn () {
      return this.$store.getters.isAuthenticated
    },
    isNominator () {
      return this.$store.getters.isNominator
    },
    user () {
      return this.$store.getters.getUser
    },
    settings () {
      return this.$store.getters.getSettings
    }
  },
  methods: {
    async reroute(uri) {
      await this.$router.push(uri)
    }
  }
}
</script>
