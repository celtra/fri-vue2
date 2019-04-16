<template>
    <div id="app">
        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Preferences</md-dialog-title>

            <md-field>
                <label>Name</label>
                <md-input v-model="name"></md-input>
            </md-field>

            <md-field>
                <label>Amount</label>
                <span class="md-prefix">$</span>
                <md-input class="md-layout-item" v-model="amount"></md-input>
            </md-field>

            <div v-for="username in availableUsernames" :key="username">
                {{ username }}
            </div>

            <md-button class="md-raised md-primary" @click="saveLog">Save</md-button>
        </md-dialog>

        <md-button class="md-fab md-primary" @click="showDialog = true">
            <md-icon>add</md-icon>
        </md-button>

        <div v-for="log in logs" :key="`${log}-${Math.random()}`">{{ `${log.name}: ${log.amount}` }}</div>
    </div>
</template>

<script>
const USERNAME = 'zan'

export default {
    name: 'App',
    data () {
        return {
            showDialog: false,
            name: null,
            amount: null,
            logs: [],
            availableUsernames: [],
        }
    },
    methods: {
        saveLog () {
            const newLog = this.logsGun.get(Date.now().toString())
            newLog.put({
                name: this.name,
                amount: this.amount
            })
            this.logsGun.set(newLog);
            this.name = null
            this.amount = null
            this.showDialog = false
        },
        logsUpdated (log) {
            this.logsGun.push(log)
        },
        onNewUser (user) {
            if (!this.availableUsernames.includes(user.username)) {
                this.availableUsernames.push(user.username)
            }
        }
    },
    created () {
        this.logsGun = this.$gun.get('logs')
        this.usersGun = this.$gun.get('users')

        this.usersGun.set({ username: USERNAME })
    
        this.logsGun.map().on(this.logsUpdated.bind(this))
        this.usersGun.map().on(this.onNewUser.bind(this))
    }
}
</script>

<style lang="less">

</style>
