<template>
  <div>
    <AddButton/>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="name" slot-scope="name">{{name.first}} {{name.last}}</template>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">Edit</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          v-if="data.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.id)"
        >
          <a href="javascript:;">Delete</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal title="Edit Guest" v-model="editModal" @ok="handleOk">
      <a-form :form="form" @submit="handleOk">
        <a-form-item label="First Name">
          <a-input
            v-decorator="[
          'first_name',
          { initialValue: this.editData.first_name},
          {rules: [{ required: true, message: 'Please enter your First Name' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="Last Name">
          <a-input
            v-decorator="[
          'last_name',
          { initialValue: this.editData.last_name},
          {rules: [{ required: true, message: 'Please enter your Last Name' }]}
        ]"
          />
        </a-form-item>
        <a-form-item label="Gender">
          <a-select
            v-decorator="[
          'gender',
          { initialValue: this.editData.gender},
          {rules: [{ required: true, message: 'Please select your Gender' }]}
        ]"
            placeholder="Gender"
          >
            <a-select-option value="Male">male</a-select-option>
            <a-select-option value="Female">female</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Email">
          <a-input
            v-decorator="[
          'email',
          { initialValue: this.editData.email},
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
          { initialValue: this.editData.number},
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
          { initialValue: this.editData.address},
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
import AddButton from "./AddButton.vue";
const columns = [
  {
    title: "First Name",
    dataIndex: "first_name"
    // sorter: true,
    // width: "20%"
    // scopedSlots: { customRender: 'name' },
  },
  {
    title: "Last Name",
    dataIndex: "last_name"
    // sorter: true,
    // width: "20%"
    // scopedSlots: { customRender: 'name' },
  },
  {
    title: "Gender",
    dataIndex: "gender"
    // filters: [
    //   { text: "Male", value: "male" },
    //   { text: "Female", value: "female" }
    // ],
    // width: "20%"
  },
  {
    title: "Email",
    dataIndex: "email"
  },
  {
    title: "Phone Number",
    dataIndex: "number"
  },
  {
    title: "Address",
    dataIndex: "address"
  },
  {
    title: "Action",
    dataIndex: "Action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "Table",
  mounted() {
    this.fetch();
  },
  data() {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns,
      visible: true,
      editModal: false,
      form: this.$form.createForm(this),
      editData: {}
    };
  },
  components: {
    AddButton,
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    fetch(params = {}) {
      this.loading = true;
      reqwest({
        url: "http://localhost:8000/api/v1/guests",
        method: "get",
        data: {
          // results: 10,
          ...params
        },
        type: "json"
      }).then(data => {
        const pagination = { ...this.pagination };
        pagination.total = data.data.length;
        this.loading = false;
        this.data = data.data;
        this.pagination = pagination;
      });
    },
    onDelete(key) {
      this.loading = true;
      reqwest({
        url: "http://localhost:8000/api/v1/guests/" + key,
        method: "DELETE",
        type: "json"
      }).then(data => {
        this.fetch();
        this.openNotification(data.message);
      });
    },
    handleOk() {
      this.loading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          reqwest({
            url: "http://localhost:8000/api/v1/guests/"+this.editData.id,
            method: "put",
            data: {
              ...values
            },
            type: "json"
          }).then(data => {
            this.loading = false;
            this.editModal = false;
            this.fetch()
            this.openNotification(data.message);         
          });
        }
      });
    },
    openNotification(message) {
      this.$notification.open({
        message: "Success",
        description: message
      });
    },
    showModal(data) {
      this.editData = data;
      this.editModal = true;
    },
    handleCancel() {
      this.editModal = false;
    }
  }
};
</script>
