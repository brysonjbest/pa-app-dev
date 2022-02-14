<template>
  <div>
    <b-form><!-- begin nomination form -->
      <b-container fluid>
        <b-row>
          <b-col cols="9">
            <div id="form-sections">
              <pageheader
                header="Partnership"
                lead="Premier's Awards Nomination for Partnership"
              />

              <h4 id="list-item-acknowledgment">Overview</h4>

              <p>This award recognizes joint ventures or multi-party initiatives between BC Public Service organizations and organizations in the broader public sector, other levels of government, Indigenous communities or in the private or non-profit sectors.</p>
              <p>Considerations may include but are not limited to</p>
              <ul>
                <li>Developing and managing sustained strategic partnerships with other government, private sector, volunteer or non-profit organizations, integrating policy and/or service delivery to better serve British Columbians</li>
                <li>Measurable benefits to either their organization(s) and/or the citizens of British Columbia through process improvements transforming business practices, and/or supporting sustainable revenue generation or savings</li>
                <li>Inclusive employee or citizen engagement practices with diverse stakeholder groups</li>
                <li>Improving the quality, cost-effectiveness, or productivity of services to internal stakeholders</li>
                <li>Improving government-to-business or government-to-citizen program or service delivery</li>
              </ul>
              <acknowledgment />

              <h4 id="list-item-organization">Organization</h4>
              <organization />

              <h4 id="list-item-title">Nomination Title</h4>
              <nominationTitle />

              <h4 id="list-item-nominators">Nominators</h4>
              <nominators />

              <h4 id="list-item-contacts">Contact Information</h4>
              <contacts />

              <h4 id="list-item-nominees">Nominees</h4>
              <nominees type="multiple" />

              <h4 id="list-item-evaluation">Evaluation Considerations</h4>
              <evaluation>
                <template v-slot:summary_overview></template>
                <template v-slot:context_overview>
                  <p>Briefly describe why the partnership was undertaken to establish a background to provide background and perspective.</p>
                </template>
                <template v-slot:complexity_overview>
                  <p>Describe the scope and scale of the joint ventures or multi-party initiatives including, but not limited to</p>
                  <ul>
                    <li>Size of the project, process or initiative</li>
                    <li>Risks encountered and overcome</li>
                    <li>Constraints such as time frame, technical, financial, organizational or policy</li>
                    <li>Challenges around aligning stakeholder or partner group interests</li>
                    <li>Technical or organizational difficulties addressed</li>
                  </ul>
                </template>

                <template v-slot:approach_overview>
                  <p>Identify key aspects of the approach and partnership including, but not limited to</p>
                  <ul>
                    <li>Developing and managing sustained strategic partnerships with other government, private sector, volunteer or non-profit organizations, integrating policy and/or service delivery to better serve British Columbians</li>
                    <li>Building relationships with internal or external stakeholder(s) to achieve mutually beneficial goals or mandates</li>
                    <li>Citizen-centric or customer-centric approach at the heart of the design and/or implementation of the partnership</li>
                    <li>Inclusive employee or citizen engagement practices with diverse stakeholder groups</li>
                    <li>Creativity and/or use of new technology or methods such as Behavioural Insights or Service Design to achieve results</li>
                    <li>Risk and/or change management strategy</li>
                    <li>Applying and/or developing best practices to remove barriers that may have prevented the successful outcome of the project</li>
                  </ul>
                </template>

                <template v-slot:impact_overview>
                  <p>Describe and use metrics (if applicable) to support the effect the partnership has on the organization, public service or citizens of British Columbia including, not limited to</p>
                  <ul>
                    <li>Measurable benefits to either their organization(s) and/or the citizens of British Columbia through process improvements transforming business practices, and/or supporting sustainable revenue generation or savings</li>
                    <li>Effect on the community, internal or external stakeholders including any social, economic and environmental benefits achieved as a result of the partnership</li>
                    <li>Extent to which the outcomes and objectives of the project, program or initiative were achieved</li>
                    <li>Effect of the partnership on operational efficiencies as demonstrated by financial or other key performance indicators</li>
                    <li>Improving quality, cost-effectiveness or productivity of services to internal and/or external stakeholders and/or the citizens of British Columbia</li>
                    <li>Extent to which the outcomes and objectives have significantly improved government-to-business or government-to-citizen program or service delivery</li>
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
import nominationTitle from '../inputs/InputNominationTitle'
import nominees from '../inputs/InputNominees'
import nominators from '../inputs/InputNominators'
import contacts from '../inputs/InputContacts'
import acknowledgment from '../inputs/InputAcknowledge'
import evaluation from '../inputs/InputEvaluation'
import attachments from '../inputs/InputAttachments'
import inputMenu from '../inputs/InputMenu'

export default {
  name: "nomination-innovation",
  components: {
    pageheader,
    organization,
    nominationTitle,
    nominees,
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
        {label: 'Nomination Title', id: 'title', required: true},
        {label: 'Nominators', id: 'nominators', required: true},
        {label: 'Contact Information', id: 'contacts', required: true},
        {label: 'Nominees', id: 'nominees', required: true},
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
