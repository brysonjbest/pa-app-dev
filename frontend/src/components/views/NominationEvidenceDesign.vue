<template>
  <div>
    <b-form v-if="!this.$store.getters.isError"><!-- begin nomination form -->
      <b-container fluid>
        <b-row>
          <b-col cols="9">
            <div id="form-sections">
              <pageheader
                header="Evidence-Based Design"
                lead="Premier's Awards Nomination for Evidence-Based Design"
              />

              <h4 id="list-item-acknowledgment">Overview</h4>
              <p>This award recognizes groups, teams or organizations in the BC Public Service whose work is outstanding in the area of evidence-based or evidence-informed policy or program development, and the process by which the policy or program was designed. This category showcases excellence in policy or program development for internal government or citizen-facing initiatives.</p>
              <p>Considerations may include but are not limited to</p>
              <ul>
                <li>The evidence-based or evidence-informed process in which the policy framework was designed</li>
                <li>The policy cycle including clear problem identification, analysis, evidence-based or evidence-informed decision making, implementation and evaluation</li>
                <li>Using foundational policy analysis tools to support recommendations such as data and/or cost analysis, cross-jurisdictional and/or international reviews or peer reviewed research</li>
                <li>Using new technology or tools such as Data Science, Service Design, etc. to support policy recommendations</li>
                <li>Inclusive citizen engagement practices reflecting a diverse population within British Columbia such as the use of GBA+ and other inclusive program development tools</li>
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
                  <p>Briefly describe why the policy or program was developed to provide background and perspective.</p>
                </template>
                <template v-slot:complexity_overview>
                  <div>
                    <p>Describe the scope and scale of the evidence-based or evidence-informed approach to developing the policy or program including, but not limited to</p>
                    <ul>
                      <li>The reason and evidence for the change or initiative necessitating the development of the policy or program</li>
                      <li>Risks encountered and overcome</li>
                      <li>Constraints such as time frame, financial or existing policy</li>
                      <li>Challenges around aligning stakeholder or partner group interests</li>
                      <li>Technical or organizational difficulties identified and addressed</li>
                    </ul>
                  </div>
                </template>

                <template v-slot:approach_overview>
                  <p>Describe how the new policy or program used an evidence-based or evidence-informed approach for the development from inception to delivery including, but not limited to</p><ul>
                  <li>The evidence-based or evidence-informed process in which the policy framework was designed</li>
                  <li>The policy cycle including clear problem identification, current state, best practices or leading edge and gap analysis, development and balanced analysis of options, evidence-based or evidence-informed decision making, implementation and evaluation</li>
                  <li>Using foundational policy analysis tools to support recommendations such as data and/or cost analysis, cross-jurisdictional and/or international reviews, peer reviewed research or stakeholder engagement</li>
                  <li>Using new technology or tools such as Data Science, Service Design, etc. to support policy recommendations</li>
                  <li>Inclusive citizen engagement practices reflecting a diverse population within British Columbia</li></ul>
                </template>

                <template v-slot:impact_overview>
                  <p>Describe and use metrics (if applicable) to support the impact of the evidence-based approach resulting in the new policy or program as demonstrated by, but not limited to</p>
                  <ul><li>Effect on the community, internal or external stakeholders including any social, economic and environmental benefits achieved as the result of the policy or program</li>
                    <li>Extent to which the outcomes and objectives of the policy or program were achieved</li>
                    <li>Effect the policy or program has on operational efficiencies as demonstrated by financial or other key performance indicators</li>
                    <li>Quantitative or measurable improvement to programs or services for citizens</li>
                    <li>Applying and/or developing best practices to remove barriers that may have prevented the successful outcome of the policy or program.</li></ul>

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
  name: "nomination-emerging-leader",
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
