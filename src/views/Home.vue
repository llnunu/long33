<template>
  <div>
    <el-container>

      <el-container>


        <el-aside width="auto" style="min-height:650px;">

          <el-menu router unique-opened active-text-color="#2FA662" :collapse="isCollapse" :collapse-transition="false">
            <div class="logo"><img :src=logoImgSrc><span v-show="!isCollapse">xxx管理系统</span></div>
            <el-submenu :index="index + ''" v-for="(item, index) in routes" v-if="!item.hidden" :key="index">
              <template slot="title">
                <i style="color: #409eff;margin-right: 5px" :class="item.iconCls"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="child.path" v-for="(child, indexj) in item.children" :key="indexj">
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>



        <el-main>
          <el-header class="homeHeader" type="flex" justify-content="space-between">
            <el-row type="flex" justify-content="space-between" style="width: 100%;">
              <el-col :span="21" class="breadcrumb_s">
                <el-button @click="toggleCollapse" :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" />

                <el-breadcrumb separator="/" v-if="this.$router.currentRoute.path != '/home'" style="margin-left: 10px;">
                  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
                </el-breadcrumb>
              </el-col>

              <el-col :span="3">
                <div style="display: flex;">
<!--                  <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color: #000000;" size="normal"-->
<!--                    @click="goChat"></el-button>-->
                  <el-dropdown class="userInfo" @command="commandHandler">
                    <span class="el-dropdown-link">
                      <em><img :src="user.userface" alt=""></em> {{ user.name }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                      <el-dropdown-item command="setting">设置</el-dropdown-item>
                      <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </el-col>

            </el-row>
          </el-header>

          <div class="homeWelcome" v-if="this.$router.currentRoute.path == '/home'">
            欢迎来到xxx系统！
          </div>
          <router-view class="homeRouterView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "Home",
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem("user"))
      isCollapse: false,
      logoImgSrc: require("@/assets/u3572_logo.png"),
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentHr;
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    goChat() {
      this.$router.push("/chat");
    },
    commandHandler(cmd) {
      if (cmd == 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("logout");
          window.sessionStorage.removeItem("user")
          this.$store.commit('initRoutes', []);
          this.$router.push({
            path: '/login',
            query: { redirect: window.location.href }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else if (cmd == 'userinfo') {
        this.$router.push('/hrinfo');
      }
    }
  }
}
</script>

<style>
.homeRouterView {
  margin-top: 10px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: #409eff;
  padding-top: 50px;
}

.homeHeader {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
  margin-top: -20px;
}

.title {
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  font-family: 华文行楷;

}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}

.breadcrumb_s {
  display: flex;
  align-items: center;
}

.logo {
  padding: 10px;
  display: flex;
  align-items: center;
  font-family: "Arial Negreta", "Arial Normal", Arial, sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 24px;
  text-rendering: optimizelegibility;
  font-feature-settings: "kern";
  font-kerning: normal;
}
</style>
