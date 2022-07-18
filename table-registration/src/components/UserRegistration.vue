<template>
  <div>
    <Message show v-if="user && isRegistered" variant="info">
      <p v-if="user.role === 'inactive'">
        Your registration is currently under review. Please check back regularly
        for updates.
      </p>
      <p v-else>
        You are currently registered as a(n) <b>{{ user.role }}</b
        >.
      </p>
    </Message>

    <form v-if="user && !isRegistered">
      <Card bg-variant="light" class="mb-3">
        <InputText
          id="input-user-register-username"
          :disabled="true"
          :value="user.username"
        >
        </InputText>

        <InputText
          id="input-user-register-firstname"
          v-model="user.firstname"
          placeholder="Enter user's given name"
        >
        </InputText>

        <InputText
          id="input-user-register-lastname"
          v-model="user.lastname"
          placeholder="Enter user's last name"
        />

        <InputText
          type="email"
          id="input-user-register-email"
          v-model="user.email"
          placeholder="Enter user's email"
        >
        </InputText>

        <Button
          v-if="mode === 'edit'"
          @click="update"
          :disabled="!validation"
          class="m-2"
          type="button"
          variant="info"
          >Update</Button
        >
        <Button
          v-else
          @click="register"
          :disabled="!validation"
          class="m-2"
          type="button"
          variant="info"
          >Register</Button
        >
        <!-- <Button
          v-if="mode === 'edit'"
          class="m-2"
          type="button"
          @click="reroute('/admin/user/list')"
          >Return to Manage Users</Button
        > -->
      </Card>
    </form>
    <!-- <b-navbar fixed="bottom" align="right">
      <b-alert
        v-if="message.text"
        show="5"
        fade
        dismissible
        :variant="message.type"
        @dismissed="message = { text: '', type: '' }"
      >
        {{ message.text }}
      </b-alert>
    </b-navbar> -->
  </div>
</template>

<script>
import { useAuthUserStore } from "../stores/users";
import { storeToRefs } from "pinia";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useMessageStore } from "../stores/messages";
import apiRoutesUsers from "../services/api-routes.users";

export default {
  setup() {
    const userStore = useAuthUserStore();
    const messageStore = useMessageStore();
    const { user } = storeToRefs(useAuthUserStore());
    const rules = {
      firstname: { required },
      lastname: { required },
      email: { required, email },
    };

    const v$ = useVuelidate(rules, user);

    const validation = function () {
      return !!this.user.guid && !!this.user.username;
    };

    const isRegistered = function () {
      const currentUser = userStore.getUser;
      return this.mode === "register" && !!currentUser.role;
    };

    const mode = function () {
      return this.$route.name === "admin-user-edit" ? "edit" : "register";
    };

    const register = async function () {
      try {
        messageStore.setMessage({
          text: "Registering user...",
          type: "info",
          spinner: true,
        });
        // handle data submission
        const response = await apiRoutesUsers.registerUser(this.user);
        const { data = null } = response || {};
        this.user = data || this.user;
        messageStore.setMessage({
          text: "Successfully registered user!",
          type: "success",
        });
      } catch (err) {
        console.error(err);
        messageStore.setMessage({
          text: "User could not be registered.",
          type: "danger",
        });
      }
    };

    return {
      user,
      rules,
      mode,
      v$,
      isRegistered,
      validation,
      register,
    };
  },
};

/*
  methods: {
    async reroute(uri) {
      await this.$router.push(uri);
    },
    async register() {
      try {
        await this.$store.dispatch("setMessage", {
          text: "Registering user...",
          type: "info",
          spinner: true,
        });
        // handle data submission
        const response = await api.post(`users/register`, this.user);
        const { data = null } = response || {};
        this.user = data || this.user;
        await this.$store.dispatch("setMessage", {
          text: "Successfully registered user!",
          type: "success",
        });
      } catch (err) {
        console.error(err);
        await this.$store.dispatch("handleError", {
          text: "User could not be registered.",
          type: "danger",
        });
      }
    },
    async update() {
      try {
        await this.$store.dispatch("setMessage", {
          text: "Updating user data...",
          type: "info",
          spinner: true,
        });
        // handle data submission
        await api.post(`users/update/${this.user.guid}`, this.user);
        await this.$store.dispatch("setMessage", {
          text: "Successfully updated user data!",
          type: "success",
        });
      } catch (err) {
        console.error(err);
        await this.$store.dispatch("handleError", {
          text: "User data could not be updated.",
          type: "danger",
        });
      }
    },
  },
  async beforeCreate() {
    try {
      await this.$store.dispatch("setMessage", {
        text: "Loading user data...",
        type: "info",
        spinner: true,
      });
      if (this.$route.name === "admin-user-edit" && this.$route.params.guid) {
        // load requested user data
        this.user = await this.$store.dispatch(
          "getUserById",
          this.$route.params.guid
        );
      } else {
        await this.$store.dispatch("login");
        this.user = await this.$store.getters.getUser;
      }
      await this.$store.dispatch("resetMessage");
    } catch (err) {
      console.error(err);
      await this.$store.dispatch("handleError", {
        text: "User data failed to load.",
        type: "danger",
      });
    }
  },
};
*/
</script>
