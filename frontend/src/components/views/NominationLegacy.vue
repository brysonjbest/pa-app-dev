<template>
  <div>
    <b-form><!-- begin nomination form -->
      <b-container fluid>
        <b-row>
          <b-col cols="9">
            <div id="form-sections">
              <pageheader
                header="Legacy"
                lead="Premier's Awards Nomination for Legacy"
              />

              <h4 id="list-item-acknowledgment">Overview</h4>
              <p>This award recognizes individuals who have made exceptional and lasting contributions to the BC Public Service and/or the province during a public service career of at least 15 years. The contributions may cover a nominee’s entire career or portions of it, provided the contribution has a lasting and ongoing positive impact.</p>
              <p>Considerations may include but are not limited to</p>
                <ul>
                  <li>Impact on peers, the internal operations and/or external organizations</li>
                  <li>Contributions to the development or application of best practices in their field of expertise</li>
                  <li>Experimental or innovative mindset whereby openness to change, taking calculated risks and challenging the status quo to try something new resulted in a measurable outcome</li>
                  <li>Embodying the ideal vision of leadership within the BC Public Service</li>
                  <li>Commitment to diversity and inclusion in both the work environment and in the development of programs, policies and services</li>
                  <li>Advocating meaningful engagement and learning with Indigenous peoples to support and facilitate reconciliation</li>
                  <li>Superior leadership through complex situations including large-scale initiatives, managing and mitigating risks, creatively solving problems and implementing solutions</li>
                  <li>Achieving outcomes despite constraints such as technical, organizational and financial</li>
                  <li>Commitment to succession management through knowledge transfer, support for continuous learning and mentorship</li>
                </ul>
              <acknowledgment />

              <h4 id="list-item-organization">Organization</h4>
              <organization />

              <h4 id="list-item-nominee">Nominee</h4>
              <nominee />

              <h4 id="list-item-nominators">Nominators</h4>
              <nominators />

              <h4 id="list-item-contacts">Contact Information</h4>
              <contacts />

              <h4 id="list-item-evaluation">Evaluation Considerations</h4>
              <evaluation>
                <template v-slot:summary_overview></template>
                <template v-slot:context_overview>
                  <p>Briefly describe the conditions under which the employee demonstrated their lasting contribution within the BC Public Service and/or the province, including career highlights, to provide background and perspective.</p>
                </template>
                <template v-slot:complexity_overview>
                  <div>
                    <p>Explain how the employee demonstrated exemplary leadership throughout their career including, but not limited to</p>
                    <ul>
                      <li>Superior leadership through complex situations including large-scale initiatives, managing and mitigating risks, creatively solving problems and implementing solutions</li>
                      <li>Constraints such as time frame, technical, financial, organizational or policy</li>
                      <li>Applying and/or developing best practices to remove barriers that may have prevented successful outcomes</li>
                    </ul>
                  </div>
                </template>

                <template v-slot:valuing_people_overview>
                  <p>Identify and describe how the employee has demonstrated their leadership in supporting the workplace either by leading a team or organization, or as leader of a substantial project, process or initiative.</p>
                  <p>Considerations may include but are not limited to</p>
                  <ul>
                    <li>Ability to create, communicate and implement a clear and compelling vision for their team aligning with the Corporate Plan for the BC Public Service</li>
                    <li>Anticipating future trends and working with others to develop strategies to meet future challenges</li>
                    <li>Ability to establish trust, motivate and receive high satisfaction ratings from their employees and/or stakeholders</li>
                    <li>Ability to involve, empower and lead staff through times of change</li>
                    <li>Investing in personal and organizational learning about trends and new ideas in their sector and the broader government context</li>
                    <li>Commitment to succession management through knowledge transfer and mentorship
                    <li>Modeling the importance of respect, inclusion, ethics and integrity and ensuring employee awareness of obligations regarding ethics and professional conduct</li>
                  </ul>
                </template>

                <template v-slot:contribution_overview>
                  <p>Describe how the individual approached leadership resulting in public service excellence. Considerations may include but are not limited to</p>
                  <ul>
                    <li>Outstanding dedication to their work while maintaining a high level of commitment to BC Public Service values and government direction</li>
                    <li>Embodying the ideal vision of leadership within the BC Public Service</li>
                    <li>Commitment to diversity and inclusion in both the work environment and in the development of programs, policies and services</li>
                    <li>Making decisions with considerations of the long-term impacts and context, anticipating emerging priorities as well as the current need</li>
                    <li>Enabling innovation by visibly and actively inviting and advancing new ideas within their organization and demonstrating the courage to embrace change</li>
                    <li>Facilitating, reinforcing and successfully leading through changes necessary to promote innovation, continuous improvement or improved service delivery to internal or external clients</li>
                    <li>Strong client service orientation ensuring service design needs are driven by citizens’ needs or client outcomes rather than internally focused metrics</li>
                    <li>Demonstrating public service values throughout their career while continually developing their subject matter expertise</li>
                  </ul>
                </template>

                <template v-slot:impact_overview>
                  <p>Describe and use metrics (if applicable) to support the ongoing positive contributions the individual has made to the BC Public Service and/or the province of British Columbia.</p>
                  <p>Considerations may include but are not limited to</p>
                  <ul>
                    <li>Measurable benefits to either their organization(s) and/or the citizens of British Columbia</li>
                    <li>Impact on the community, internal operations and/or external organizations including any social, economic and environmental benefits achieved as a result of their work</li>
                    <li>Improving the quality of the workplace for employees by contributing to the enhancement of diversity, health and safety, workplace culture and employee development</li>
                    <li>Experimental or innovative mindset whereby openness to change, taking calculated risks and challenging the status quo to try something new resulted in a measurable outcome</li>
                    <li>Improving the quality, cost-effectiveness or productivity of services to internal or external stakeholders</li>
                    <li>Improving government-to-business or government-to-citizen service delivery</li>
                    <li>Provincial, national or global recognition for the contributions to the development of best practices in their field of expertise</li>
                  </ul>
                </template>
              </evaluation>

              <h4 id="list-item-attachments">Attachments</h4>
              <attachments />

            </div>
          </b-col>

          <b-col cols="3">
            <inputMenu :inputs="inputs" />
          </b-col>

        </b-row>
      </b-container>

    </b-form><!-- end nomination form -->

  </div>
</template>

<script>

import pageheader from '../common/PageHeader'
import organization from '../inputs/InputOrganization'
import nominee from '../inputs/InputNominee'
import nominators from '../inputs/InputNominators'
import contacts from '../inputs/InputContacts'
import acknowledgment from '../inputs/InputAcknowledge'
import evaluation from '../inputs/InputEvaluation'
import attachments from '../inputs/InputAttachments'
import inputMenu from '../inputs/InputMenu'

export default {
  name: "nomination-legacy",
  components: {
    pageheader,
    organization,
    nominee,
    nominators,
    contacts,
    acknowledgment,
    evaluation,
    attachments,
    inputMenu
  },
  data () {
    return {
      inputs: [
        {label: 'Overview', id: 'acknowledgment', required: true},
        {label: 'Organization', id: 'organization', required: true},
        {label: 'Nominee', id: 'nominee', required: true},
        {label: 'Nominators', id: 'nominators', required: true},
        {label: 'Contact Information', id: 'contacts', required: true},
        {label: 'Evaluation Considerations', id: 'evaluation', required: true},
        {label: 'Attachments', id: 'attachments', required: false}
      ]
    }
  },
  async beforeCreate() {
    this.$store.dispatch('loadNomination', this.$route.params.id)
      .catch(err => {
        console.error(err)
        this.$store.dispatch('handleError',
          {text: 'Nomination failed to load.', type: 'danger'}
        )
      })
  }
};
</script>
<style>
form h4 {
  padding-top: 70px;
}
</style>
