<template>
  <div>
    <a-button class="editable-add-btn" @click="showModal">Add Guest</a-button>
    <a-modal title="Add Guest" v-model="visible" @ok="handleOk">
      <a-form :form="form" @submit="handleOk">
        <a-form-item label="First Name">
          <a-input
            v-decorator="[
          'first_name',
          {rules: [{ required: true, message: 'Please enter your First Name' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="Last Name">
          <a-input
            v-decorator="[
          'last_name',
          {rules: [{ required: true, message: 'Please enter your Last Name' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="Gender">
          <a-select
            v-decorator="[
          'gender',
          {rules: [{ required: true, message: 'Please select your Gender' }]}
        ]"
            placeholder="Gender"
          >
            <a-select-option value="male">male</a-select-option>
            <a-select-option value="female">female</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Email">
          <a-input
            v-decorator="[
          'email',
          {rules: [
              { type: 'email', message: 'The Input is not valid E-mail'},
              { required: true, message: 'Please enter your Email' }
              ]}
        ]"
          />
        </a-form-item>
        <a-form-item label="Phone Number">
          <a-input
            v-decorator="[
          'number',
          {rules: [
              { required: true, message: 'Please enter your Phone Number' }
              ]}
        ]"
          />
        </a-form-item>
        <a-form-item label="Address">
          <a-input
            v-decorator="[
          'address',
          {rules: [
              { required: true, message: 'Please enter your Address' }
              ]}
        ]"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">Return</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import reqwest from "reqwest";
export default {
  name: "AddButton",
  data() {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this)
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          reqwest({
            url: "http://localhost:8000/api/v1/guests",
            method: "post",
            data: {
              ...values
            },
            type: "json"
          }).then(data => {
            this.loading = false;
            this.visible = false;
            this.$parent.fetch();
            this.$parent.openNotification(data.message)
          });
        }
      });
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>
