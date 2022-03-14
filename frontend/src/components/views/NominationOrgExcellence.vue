<template>
  <div>
    <b-form><!-- begin nomination form -->
      <b-container fluid>
        <b-row>
          <b-col cols="9">
            <div id="form-sections">
              <pageheader
                header="Organizational Excellence"
                lead="Premier's Awards Nomination for Organizational Excellence"
              />

              <h4 id="list-item-acknowledgment">Overview</h4>
              <p>This award recognizes one or more BC Public Service organizations that have delivered a program, service or initiative resulting in substantial benefits to their organization(s), the public service or citizens.</p>
              <p>Considerations may include but are not limited to</p>
              <ul>
                <li>Citizen-centric or customer-centric approach at the heart of the design and/or implementation of a policy/project</li>
                <li>Inclusive employee or citizen engagement practices with diverse stakeholder groups</li>
                <li>Improving quality, cost-effectiveness or productivity of services to internal stakeholders</li>
                <li>Improving government-to-business or government-to-citizen service delivery</li>
                <li>Measurable benefits to either their organization(s) and/or the citizens of British Columbia through process improvements to transform business practices, and/or support sustainable revenue generation or savings</li>
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

              <h4 id="list-item-partners">Nominees/Partners</h4>
              <nominees />
              <partners />

              <h4 id="list-item-evaluation">Evaluation Considerations</h4>
              <evaluation>
                <template v-slot:summary_overview></template>
                <template v-slot:context_overview>
                  <p>Briefly describe why the new approach to the program, service or initiative was undertaken to provide background and perspective.</p>
                </template>
                <template v-slot:complexity_overview>
                  <div>
                    <p>Describe the scope and scale of the delivery of the program, service or initiative resulting in substantial benefits to their organization, the public service or citizens of British Columbia including, but not limited to</p>
                    <ul>
                      <li>Size of the program, service or initiative</li>
                      <li>Risks encountered and overcome</li>
                      <li>Constraints such as time frame, financial or policy</li>
                      <li>Challenges around aligning stakeholder or partner group interests</li>
                      <li>Technical or organizational difficulties identified and addressed</li>
                    </ul>
                  </div>
                </template>

                <template v-slot:approach_overview>
                  <p>Identify key aspects of the approach taken in the delivery of the new program, service or initiative including, but not limited to</p>
                  <ul>
                    <li>Citizen-centric or customer-centric approach at the heart of the design and/or implementation of a policy/project</li>
                    <li>Supporting innovation, risk taking and a commitment to ongoing improvements by incorporating or contributing to best practices</li>
                    <li>Removing barriers to overcome constraints</li>
                    <li>Change resilience strategies supporting success while going through change and transformation</li>
                    <li>Attention to cross-government processes critical for meeting stakeholder needs</li>
                  </ul>
                </template>


                <template v-slot:impact_overview>
                  <p>Describe and use metrics (if applicable) to support the outcomes the program, service or initiative has on the organization, public service or citizens of British Columbia including, not limited to</p>
                  <ul>
                    <li>Process improvements in business practices</li>
                    <li>Extent to which the outcomes and objectives significantly improve government-to-business or government-to-citizen service delivery</li>
                    <li>Increasing client satisfaction due to high quality service delivery</li>
                    <li>Measurable benefits to either their organization(s) and/or the citizens of British Columbia through process improvements transforming business practices and/or supporting sustainable revenue generation or savings</li>
                    <li>Operational efficiencies as demonstrated by financial or other key performance indicators</li>
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
import partners from '../inputs/InputPartners'
import nominators from '../inputs/InputNominators'
import contacts from '../inputs/InputContacts'
import acknowledgment from '../inputs/InputAcknowledge'
import evaluation from '../inputs/InputEvaluation'
import attachments from '../inputs/InputAttachments'
import inputMenu from '../inputs/InputMenu'

export default {
  name: "nomination-emerging-leader",
  components: {
    pageheader,
    organization,
    nominationTitle,
    nominees,
    partners,
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
        {label: 'Nominees/Partners', id: 'partners', required: true},
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
    // set nomination type
    this.$store.commit('setNomination', {type: 'organization'})
  }
};
</script>
<style>
form h4 { padding-top: 70px; }
</style>
