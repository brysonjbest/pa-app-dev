<template>
  <div>

    <b-form v-if="!this.$store.getters.isError"><!-- begin nomination form -->

    <b-container fluid>
      <b-row>
        <b-col cols="9">
          <div id="form-sections">

            <pageheader header="Emerging Leader" lead="Premier's Awards Nomination for Emerging Leader" />

            <h4 id="list-item-acknowledgment">Overview</h4>
            <p>This award recognizes a BC Public Service employee 40 years and under and at or below the level of director who has made a significant impact in their ministry, division, workgroup or the greater BC Public Service early in their career.</p>
            <p>Considerations may include but are not limited to</p>
            <ul>
              <li>Superior formal or informal leadership with colleagues across all levels of the organization</li>
              <li>Superior formal or informal leadership through innovative problem solving, team building, collaboration and a strong client service orientation</li>
              <li>Thought leader who can articulate a strong case for change, self-motivate and motivate others through change and demonstrate success through measurable project/program outcomes</li>
              <li>Commitment to diversity and inclusion in both the work environment and in the development of programs, policies and services</li>
              <li>Ethical leadership practices</li>
              <li>Supporting innovation, new technology and best practices</li>
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
                <p>Briefly describe the conditions under which the employee demonstrates exemplary leadership to provide background and perspective.</p>
              </template>

              <template v-slot:valuing_people_overview>
                <p>Identify and describe how the employee demonstrates their leadership in supporting the workplace including, but not limited to</p>
                <ul>
                  <li>Innovative problem solving, team building and collaborating with colleagues at all levels of the organization</li>
                  <li>Actively enhancing the quality of the workplace through commitment to diversity and inclusion in both the work environment and the development of programs, policies and services</li>
                  <li>Integrity and commitment to ethical conduct and decision making</li>
                </ul>
              </template>

              <template v-slot:commitment_overview>
                <p>Identify and describe how the employee demonstrates their leadership in operations including, but not limited to</p>
                <ul>
                  <li>Commitment to and pride in the BC Public Service by contributions enhancing its reputation</li>
                  <li>Ability to constructively articulate a strong case for change by challenging assumptions, timelines and recommendations to ensure they are driven by citizens’ needs rather than administrative convenience</li>
                  <li>Supporting innovation, new technology and best practices by modelling a culture of curiosity, collaborating, encouraging dialogue and inviting competing ideas</li>
                  <li>Making decisions with considerations of the long-term impacts and context, anticipating emerging priorities as well as the current need</li>
                  <li>Thoughtful risk management and ability to accept failure by learning, improving and moving forward</li>
                  <li>Success through measurable project/program outcomes</li>
                </ul>
              </template>
              <template v-slot:impact_overview>
                <p>Describe and use metrics (if applicable) to support how the employee exemplifies the future of corporate leadership as demonstrated by, but not limited to</p>
                <ul>
                  <li>Effect on employees, clients, the public service and/or citizens of British Columbia</li>
                  <li>Improving the quality of the workplace for employees by contributing to the enhancement of diversity, health and safety, workplace culture and employee development</li>
                  <li>Supporting innovation, new technology and best practices, resulting in the improvement of workplace processes such as reduced costs, increased efficiencies, or safety</li>
                  <li>Measurable benefits to their organization(s) and/or the citizens through process improvements to transform business practices, and/or sustainable revenue generation or savings.</li>
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
  name: "nomination-emerging-leader",
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
