<template>
  <div>
    <PrimeMessage show v-if="isRegistered()" variant="info" :closable="false">
      <p v-if="user.role === 'inactive'">
        Your registration is currently under review. Please check back regularly
        for updates.
      </p>
      <p v-else>
        You are currently registered as a(n) <b>{{ user.role }}</b
        >.
      </p>
    </PrimeMessage>
    <PrimeMessage
      show
      v-if="activeMessage"
      :variant="message.type"
      :life="5000"
      :sticky="false"
    >
      <p>
        {{ message.text }}
      </p>
    </PrimeMessage>

    <PrimeCard v-if="!isRegistered() || edit">
      <template #content>
        <form>
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
          <PrimeButton
            v-if="edit"
            @click="update"
            :disabled="!validation"
            class="m-2"
            type="button"
            variant="info"
            >Update</PrimeButton
          >

          <PrimeButton
            v-else
            @click="register"
            :disabled="!validation"
            class="m-2"
            type="button"
            variant="info"
            >Register</PrimeButton
          >
        </form>
      </template>
    </PrimeCard>
  </div>
</template>

<script>
import { useAuthUserStore } from "../stores/users";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useMessageStore } from "../stores/messages";
import apiRoutesUsers from "../services/api-routes.users";

export default {
  props: {
    edit: Boolean,
  },
  setup() {
    const userStore = useAuthUserStore();
    const messageStore = useMessageStore();
    const { message } = storeToRefs(useMessageStore());
    const activeMessage = ref(false);
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
      return currentUser.role;
    };

    const register = async function () {
      try {
        activeMessage.value = true;
        messageStore.setMessage({
          text: "Registering user...",
          type: "info",
          spinner: true,
        });
        // handle data submission
        await apiRoutesUsers.registerUser(user.value).then(() => {
          messageStore.setMessage({
            text: "Successfully registered user!",
            type: "success",
          });
        });
      } catch (err) {
        console.error(err);
        activeMessage.value = true;
        messageStore.setMessage({
          text: "User could not be registered.",
          type: "error",
        });
      }
    };

    const update = async function () {
      try {
        activeMessage.value = true;
        messageStore.setMessage({
          text: "Updating user...",
          type: "info",
          spinner: true,
        });

        // handle data submission
        await apiRoutesUsers.updateUser(user.value.guid, user.value);
        messageStore.setMessage({
          text: "Successfully updated user!",
          type: "success",
        });
      } catch (err) {
        console.error(err);
        activeMessage.value = true;
        messageStore.setMessage({
          text: "User could not be updated.",
          type: "error",
        });
      }
    };

    return {
      user,
      message,
      rules,
      v$,
      isRegistered,
      validation,
      register,
      update,
      activeMessage,
    };
  },
};
</script>
