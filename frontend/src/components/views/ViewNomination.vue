<template>
  <div>
      <RedirectButton
        label="Return to My Nominations"
        :show="this.$store.getters.isError"
        uri="/list"
      />
      <b-card v-if="!this.$store.getters.isError && nomination._id">
        <b-container class="p-3">
          <b-row>
            <b-col align="right">
              <EditMenu
                :disabled="nomination.submitted"
                :id="nomination._id"
                :category="nomination.category"
                :show="['edit', 'delete']"
              />
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col>
              <h3 class="text-center">
                Nomination Details
                <b-badge :variant="nomination.submitted ? 'success' : 'warning'">
                  {{ nomination.submitted ? 'Submitted' : 'Draft' }}
                </b-badge>
              </h3>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Year</h5>
            </b-col>
            <b-col>
              <p>{{ nomination.year }}</p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Category</h5>
            </b-col>
            <b-col>
              <p>
                {{ lookup('categories', nomination.category) }}
                ({{ nomination.category }})
              </p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>ID</h5>
            </b-col>
            <b-col>
              {{nomination._id}}
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>GUID</h5>
            </b-col>
            <b-col>
              <p>{{ nomination.guid }}</p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Submitted</h5>
            </b-col>
            <b-col>
              <p><b>{{ nomination.submitted ? 'Yes' : 'No' }}</b></p>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Organization</h5>
            </b-col>
            <b-col>
              {{lookup('organizations', nomination.organization)}}
            </b-col>
          </b-row>
          <b-row v-if="nomination.nominee && nominationType === 'individual'">
            <b-col cols="3">
              <h5>Nominee</h5>
            </b-col>
            <b-col>
              <b-table
                stacked
                :items="[nomination.nominee]"
                :fields="['firstname', 'lastname']"
                primary-key="id"
              ></b-table>
            </b-col>
          </b-row>
          <b-row  v-if="!!nomination.title && nominationType === 'organization'" class="mb-4">
            <b-col cols="3">
              <h5>Title</h5>
            </b-col>
            <b-col>{{nomination.title}}</b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col cols="3">
              <h5>Acknowledgment</h5>
            </b-col>
            <b-col>
              <p>{{ nomination.acknowledgment.toUpperCase() }}</p>
            </b-col>
          </b-row>
          <b-row v-if="nomination.nominees && nominationType === 'organization'" class="mb-4">
            <b-col cols="3">
              <h5>Nominees</h5>
            </b-col>
            <b-col>
              <p>{{ nomination.nominees }}</p>
            </b-col>
          </b-row>
          <b-row v-if="nomination.partners && nominationType === 'organization'">
            <b-col cols="3">
              <h5>Partners</h5>
            </b-col>
            <b-col>
              <b-table
                :items="nomination.partners"
                :fields="['organization']"
                striped
                responsive="sm"
                primary-key="id"
              >
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"><h5>Nominators</h5></b-col>
            <b-col>
              <b-table
                stacked
                :items="nomination.nominators"
                :fields="['firstname', 'lastname', 'title', 'email']"
                primary-key="id"
              ></b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3"><h5>Contacts</h5></b-col>
            <b-col>
              <h5>Primary</h5>
              <b-table
                stacked
                :items="[nomination.contacts.primary]"
                :fields="['firstname', 'lastname', 'title', 'email', 'phone']"
                primary-key="id"
              ></b-table>
              <h5>Video</h5>
              <b-table
                stacked
                :items="[nomination.contacts.video]"
                :fields="['firstname', 'lastname', 'title', 'email', 'locations']"
                striped
                responsive="sm"
                primary-key="id"
              >
                <template #cell(locations)="contact">
                  <b-table
                    :items="contact.item.locations"
                    :fields="['address', 'city']"
                  ></b-table>
                </template>
              </b-table>

            </b-col>
          </b-row>
          <b-row>
            <b-col><h5>Evaluation</h5></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                stacked
                :items="[nomination.evaluation]"
                primary-key="id"
              >
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col><h5>Attachments</h5></b-col>
          </b-row>
          <b-row
            v-for="(attachment, index) in attachments"
            v-bind:key="index"
            align-h="between"
            class="m-2"
          >
            <b-col cols="2">
              <b>File {{index + 1}}</b>
                <b-button
                  block
                  size="sm"
                  class="mr-2"
                  variant="outline-primary"
                  @click="downloadAttachment(attachment)"
                >
                  Download
                </b-button>
            </b-col>
            <b-col>
              <b-table
                size="sm"
                responsive="sm"
                stacked
                :items="[{label: attachment.label, description: attachment.description}]"
                :fields="[
                  {key: 'label', label: 'Label'},
                  {key: 'description', label: 'Description'}
                  ]"
              />
                <b-table
                  size="sm"
                  stacked
                  :items="[attachment.file]"
                  :fields="[
                  {key: 'originalname', label: 'Filename'},
                  {key: 'mimetype', label: 'Format'},
                  {key: 'size', label: 'Filesize'},
                  {key: 'download', label:''}
                  ]"
                  responsive="sm"
                  primary-key="id"
                >
                  <template #cell(mimetype)="row">
                    {{lookup('mimeTypes', row.item.mimetype)}} document
                  </template>
                  <template #cell(size)="row">
                    {{Math.floor(row.item.size / 1000)}} kB
                  </template>
                </b-table>
            </b-col>
          </b-row>
        </b-container>
      </b-card>

  </div>
</template>

<script>

import formServices from '@/services/settings.services'
import EditMenu from '@/components/common/EditMenu'
import RedirectButton from '@/components/common/RedirectButton'
import app from '@/services/api.services'
import { saveAs } from 'file-saver';

export default {
  name: 'nomination-view',
  components: {
    EditMenu, RedirectButton
  },
  computed: {
    nomination () {
      return this.$store.getters.getNomination
    },
    attachments () {
      return this.$store.getters.getAttachments
    },
    nominationType() {
      return formServices.lookupType(this.nomination.category)
    }
  },
  methods: {
    lookup(key, value) {
      return formServices.lookup(key, value)
    },
    downloadAttachment (attachment) {
      const {_id = '', file = null} = attachment || {};
      const {originalname = ''} = file || {};
      this.message = {
        text: 'Downloading file...',
        type: 'info'
      }
      return app.get(
        `attachments/download/${_id}/`,
        {responseType: 'blob'}
      )
        .then(res => {
          saveAs(res.data, originalname);
          this.message = {
            text: 'File downloaded successfully!',
            type: 'success'
          }
        }).catch(err => {
          console.error(err)
          this.message = {
            text: 'Download failed.',
            type: 'danger'
          }
          return []
        })
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
}
</script>
