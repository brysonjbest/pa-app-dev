<template>
  <div>
    <b-form><!-- begin nomination form -->
      <b-container fluid>
        <b-row>
          <b-col cols="9">
            <div id="form-sections">
              <pageheader
                header="Regional Impact"
                lead="Premier's Awards Nomination for Regional Impact"
              />

              <h4 id="list-item-acknowledgment">Overview</h4>
              <p>This award recognizes groups, teams or organizations within the BC Public Service who have developed and delivered programs, projects and initiatives benefiting citizens in a specific location (town, city, municipality or region).</p>
              <p>Considerations may include but are not limited to</p>
              <ul>
                <li>Projects or initiatives directly benefitting citizens in the specific town, city, municipality or region</li>
                <li>Recognizing merit regardless of the project/initiative’s size or pedigree and those with less visibility which are more grassroots in nature</li>
                <li>Generating innovative ideas, fresh perspectives and new opportunities</li>
                <li>Citizen engagement practices with diverse stakeholder groups</li>
                <li>Citizen-centric or customer-centric approach at the heart of the design and/or implementation of a policy/project</li>
                <li>Developing and managing sustained strategic partnerships with local government, Indigenous, private sector, volunteer or non-profit organizations, integrating policy and/or service delivery to better serving British Columbians in a specific location</li>
                <li>Experimental or innovative mindset whereby openness to change, taking calculated risks and challenging the status quo to try something new resulted in a measurable outcome</li>
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
                  <p>Briefly describe why the new program, project or initiative was undertaken to provide background and perspective.</p>
                </template>
                <template v-slot:complexity_overview>
                  <p>Describe the scope and scale of the program, project or initiative resulting in significant impact directly benefiting local citizens including, but not limited to</p>
                  <ul>
                    <li>Size of the program, service or initiative</li>
                    <li>Risks encountered</li>
                    <li>Challenges around introducing a new approach to solve a problem</li>
                    <li>Constraints such as time frame, financial, policy or technical</li>
                    <li>Challenges around aligning stakeholder or partner group interests</li>
                  </ul>
                </template>

                <template v-slot:approach_overview>
                  <p>Describe key aspects of the approach taken throughout the development of the new program, project or initiative including, but not limited to</p>
                  <ul>
                    <li>The process used to generate innovative ideas, fresh perspectives, new opportunities and creativity in the design</li>
                    <li>User-centric or citizen-centric approach in the development of the initiative/program</li>
                    <li>Inclusive citizen engagement practices with diverse stakeholder groups</li>
                    <li>Adapting and refining the approach when things did not work well and learning from the setbacks/mistakes</li>
                    <li>Applying and/or developing best practices to remove barriers that may have prevented the successful outcome of the project</li>
                    <li>Risk and/or change management strategy</li>
                    <li>Building relationships with external stakeholder(s) to achieve mutually beneficial goals or mandates</li>
                  </ul>
                </template>

                <template v-slot:impact_overview>
                  <p>Describe and use metrics (if applicable) to support the outcomes and impact the program, project or initiative has on the BC Public Service and local citizens including, but not limited to</p>
                  <ul>
                    <li>Experimental or innovative mindset whereby openness to change, taking calculated risks and challenging the status quo to try something new resulted in a measurable outcome</li>
                    <li>Extent to which the outcomes and objectives of the project, program or initiative were achieved</li>
                    <li>Quantitative or measurable improvement to the program, project or initiative</li>
                    <li>Efficiencies and improvements as demonstrated by financial or other key performance indicators</li>
                    <li>Effect on the community, internal or external stakeholders including any social, economic and environmental benefits achieved</li>
                    <li>Effect on external stakeholders such as increased client satisfaction to high quality service delivery</li>
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
  name: "nomination-regional-impact",
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
