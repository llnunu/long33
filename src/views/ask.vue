<template>
  <div>
    
    <div class="loginContainer">
    
      <el-descriptions title="回答" style="color: aliceblue;">
          <el-descriptions-item label="回答">{{ reply }}</el-descriptions-item>
      </el-descriptions>

      <div v-loading="loading"
            element-loading-text="思考中。。。"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)" class="load"/>

      <div class="abc">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="params.prompt"/>
        <el-button type="primary" icon="el-icon-search" @click="submit2()">提问</el-button>
      </div>
    </div>

  </div>
  
</template>

<script>
import axios from 'axios'
export default {
  name: "ask",
  data() {
    return {
      question: '',
      reply: '',
      loading: false,
      params: {
          "prompt": "",
          "userId": "#/chat/1682039457204",
          "network": true,
          "system": "",
          "withoutContext": false
      }
    }
  },
  
  beforeCreate() {
    document.querySelector('body').classList.add("overall");
  },
  beforeDestroy() {
    document.querySelector('body').classList.remove("overall");
  },

  methods: {
    submit() {
      this.loading = true;
      this.getRequest("question?messages=" + this.question).then(resp => {
              console.log(resp)
              this.reply = resp;
              if(resp != undefined) {
                this.loading = false;
              }
              // if(resp.status == 200) {
              //   console.log(resp)
              // }
            });
    },

    submit2() {
      this.loading = true;
      axios({
        headers: {
        'origin': 'https://chat.aichatos.top'
        },
        method: 'post',
        url: `https://api.aichatos.cloud/api/generateStream`,
        data: this.params
    }).then(resp => {
              this.reply = resp;
              if(resp != undefined) {
                this.loading = false;
              }
            });
    }
  }
}
</script>

<style>
.loginContainer {
  background-clip: padding-box;
  width: 100%;
  height: 100%;

}

.abc {
  position: absolute;
    bottom: 0px;
    width: 100%;
    display: flex;
}

.load {
  width: 100%;
  height: 50px;
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 52px;
}

.overall {
  position: absolute;
  content: ' ';
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  background-image: url(../assets/huahua.jpg);
  background-size: cover;
}
</style>
