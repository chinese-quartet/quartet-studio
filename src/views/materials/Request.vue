<template>
  <a-row class="request-container">
    <a-row class="steps-container">
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <a-row class="steps-content">
        <vue-markdown v-if="current === 0" :source="license" @rendered="update" class="markdown-viewer"></vue-markdown>
        <a-row v-if="current === 1">
          <a-form class="info-form" :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-col class="basic-info" :lg="12" :md="24" :sm="24" :xs="24">
              <a-form-item label="Materials Type">
                <a-select
                  v-decorator="[
                    'materialsType',
                    {
                      initialValue: materialsType,
                      rules: [{ required: true, message: 'Please select your request!' }],
                    },
                  ]"
                  placeholder="Select a materials type"
                >
                  <a-select-option value="DNA">DNA</a-select-option>
                  <a-select-option value="RNA">RNA</a-select-option>
                  <a-select-option value="Protein">Protein</a-select-option>
                  <a-select-option value="Metabolite">Metabolite</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <span slot="label">
                  Sets&nbsp;
                  <a-tooltip
                    title="This refers to a set of four samples, D5, D6, F7, and M8. If you need a number of single samples or other combinations of samples, please note in the Additional Notes field."
                  >
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </span>
                <a-input-number
                  :min="1"
                  :max="100"
                  v-decorator="['tubes', { rules: [{ required: true, message: 'How many sets?' }] }]"
                  placeholder="How many sets you request?"
                />
              </a-form-item>
              <a-form-item label="Purpose">
                <a-input
                  v-decorator="['purpose', { rules: [{ required: true, message: 'Purpose of materials request?' }] }]"
                  placeholder="Purpose of materials request?"
                />
              </a-form-item>
              <a-form-item label="Requestor Title">
                <a-input
                  v-decorator="['requestorTitle', { rules: [{ required: true, message: 'What\'s your title?' }] }]"
                  placeholder="What's your title?"
                />
              </a-form-item>
              <a-form-item label="Requestor Name">
                <a-input
                  v-decorator="['requestorName', { rules: [{ required: true, message: 'What\'s your name?' }] }]"
                  placeholder="What's your name?"
                />
              </a-form-item>
              <a-form-item label="Requestor Email">
                <a-input
                  v-decorator="[
                    'requestorEmail',
                    {
                      rules: [
                        { required: true, message: 'What\'s your email?' },
                        { type: 'email', message: 'It\'s not a valid email.' },
                      ],
                    },
                  ]"
                  placeholder="What's your email?"
                />
              </a-form-item>
              <a-form-item label="Organization">
                <a-input
                  v-decorator="['organization', { rules: [{ required: true, message: 'What\'s your organization?' }] }]"
                  placeholder="What's your organization?"
                />
              </a-form-item>
            </a-col>
            <a-col class="additional-info" :lg="12" :md="24" :sm="24" :xs="24">
              <a-form-item label="Recipients">
                <a-input
                  v-decorator="['recipients', { rules: [{ required: true, message: 'What\'s recipients name?' }] }]"
                  placeholder="What's recipients name?"
                />
              </a-form-item>
              <a-form-item label="Phone Number">
                <a-input
                  v-decorator="[
                    'phoneNumber',
                    {
                      rules: [{ required: true, message: 'What\'s phone number of the recipients?' }],
                    },
                  ]"
                  placeholder="What's phone number of the recipients?"
                />
              </a-form-item>
              <a-form-item label="Delivery Address">
                <a-input
                  v-decorator="[
                    'deliveryAddress',
                    { rules: [{ required: true, message: 'What\'s delivery address?' }] },
                  ]"
                  placeholder="What's delivery address?"
                />
              </a-form-item>
              <a-form-item label="Additional Notes">
                <a-textarea v-decorator="['notes']" placeholder="Any notes" :auto-size="{ minRows: 3, maxRows: 5 }" />
              </a-form-item>
            </a-col>
          </a-form>
        </a-row>
        <a-row v-if="current === 2">
          <p v-html="additionalNotes" class="notes"></p>
        </a-row>
      </a-row>
      <a-row class="agreement-btn">
        <a-radio-group @change="acceptLicense" default-value="disagree" v-if="current === 0">
          <a-radio value="agree">I accept the agreement</a-radio>
          <a-radio value="disagree">I don't accept the agreement</a-radio>
        </a-radio-group>
      </a-row>
      <a-row class="steps-action">
        <a-button v-if="previousActive" style="margin-right: 8px" @click="prev">Previous</a-button>
        <a-button v-if="nextActive" :disabled="disableNext" type="primary" @click="next">Next</a-button>
        <a-button v-if="doneActive" type="primary" @click="finish">Done</a-button>
      </a-row>
    </a-row>
  </a-row>
</template>

<script>
import axios from 'axios'
import { submitMessage } from '@/api/manage'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'

export default {
  components: {
    VueMarkdown
  },
  data() {
    return {
      current: 0,
      steps: [
        {
          title: 'License & Disclaimer',
          content: '',
          ready: false
        },
        {
          title: 'Request Details',
          content: 'Second-content',
          ready: false
        },
        {
          title: 'Additional Notes',
          content: '',
          ready: false
        }
      ],
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      email: 'quartet@fudan.edu.cn'
    }
  },
  computed: {
    materialsType() {
      return this.$route.query.materialsType ? this.$route.query.materialsType : 'DNA'
    },
    additionalNotes() {
      return this.getPageContent('additional-notes')
    },
    license() {
      return this.getPageContent('license')
    },
    previousActive() {
      return this.current > 0
    },
    nextActive() {
      return this.current < this.steps.length - 1
    },
    doneActive() {
      return this.current === this.steps.length - 1
    },
    disableNext() {
      if (this.steps[this.current].ready) {
        return false
      } else {
        return true
      }
    },
    licensePage() {
      return this.current === 0
    },
    formPage() {
      return this.current === 1
    }
  },
  methods: {
    update() {
      this.$nextTick(() => {
        Prism.highlightAll()
      })
    },
    next() {
      if (this.licensePage) {
        this.showNextPage()
        this.setPageStatus('request-form', true)
      } else if (this.formPage) {
        this.submitRequest()
      }
    },
    prev() {
      this.current--
    },
    finish() {
      this.$message.success('Processing complete!')
      this.$router.push({
        name: 'materials'
      })
    },
    setPageStatus(pageName, ready) {
      if (pageName === 'license') {
        this.steps[0].ready = ready
      } else if (pageName === 'request-form') {
        this.steps[1].ready = ready
      }
    },
    setPageContent(pageName, content) {
      if (pageName === 'license') {
        this.steps[0].content = content
      } else if (pageName === 'request-form') {
        this.steps[1].content = content
      } else if (pageName === 'additional-notes') {
        this.steps[2].content = content
      }
    },
    getPageContent(pageName) {
      if (pageName === 'license') {
        return this.steps[0].content
      } else if (pageName === 'request-form') {
        return this.steps[1].content
      } else if (pageName === 'additional-notes') {
        return this.steps[2].content
      }
    },
    submitRequest() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          submitMessage({
            title: values.purpose,
            description: values.notes ? values.notes : '',
            message_type: 'request-materials',
            payload: values,
            status: 'Unread'
          })
            .then(response => {
              const content =
                `Dear ${values.requestorTitle} ${values.requestorName},` +
                '<br/>' +
                'Thank you very much for your trust on us.' +
                '<br/>' +
                `We will contact you as soon as possible through the email address (${
                  values.requestorEmail
                }) you provided.` +
                '<br/>' +
                `You could contact us by <b>feedback function</b> or <b>${
                  this.email
                }</b>, if you have any questions or feedbacks.` +
                '<br/>' +
                'Yours sincerely,' +
                '<br/>' +
                '<br/>' +
                'Quartet Team' +
                '<br/>' +
                `Email: ${this.email}`
              this.setPageContent('additional-notes', content)
              this.showNextPage()
            })
            .catch(error => {
              this.$message.error('Something wrong, please retry later.')
              console.log('Submit Message Error: ', error)
            })
        }
      })
    },
    showNextPage() {
      this.current++
    },
    acceptLicense(e) {
      console.log('Accept License: ', e)
      if (e.target.value === 'agree') {
        this.setPageStatus('license', true)
      } else {
        this.setPageStatus('license', false)
      }
    },
    fetchLicense() {
      axios
        .get('/markdown/materials-license.md')
        .then(response => {
          console.log('getMaterialsLicense: ', response.data)
          this.setPageContent('license', response.data)
        })
        .catch(error => {
          this.$message.error('Cannot find the license file.')
          this.setPageContent('license', 'No license file.')
          console.log('getMaterialsLicense Error: ', error)
        })
    }
  },
  created() {
    this.fetchLicense()
  }
}
</script>

<style lang="less" scoped>
.request-container {
  width: 100%;
  height: 100%;
  min-height: 620px;
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  .steps-container {
    margin: 30px;
    width: 80%;

    .steps-content {
      margin-top: 16px;
      border: 1px dashed #e9e9e9;
      border-radius: 6px;
      background-color: #fafafa;
      height: 475px;
      padding-top: 30px;
      overflow: scroll;

      .info-form {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding-right: 20px;
      }

      .notes {
        text-align: justify;
        padding: 0px 20px;
        font-size: 16px;
        line-height: 3;
      }

      .ant-form {
        .ant-input-number {
          width: 100%;
        }
      }

      .markdown-viewer {
        overflow: scroll;
        text-align: left;
        margin: 0px 30px;
      }
    }

    .steps-action {
      display: flex;
      justify-content: flex-end;
    }

    .agreement-btn {
      margin-top: 5px;
    }
  }
}
</style>