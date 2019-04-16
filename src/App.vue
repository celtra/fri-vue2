<template>
    <div id="app">
        <md-dialog class="dialog" :md-active.sync="showDialog">
            <md-field>
                <label>Amount</label>
                <span class="md-prefix">$</span>
                <md-input class="md-layout-item" type="number" v-model="amount"></md-input>
            </md-field>

            <md-checkbox v-for="user in availableUsernames" :key="user.name" v-model="user.isInvolved">{{ user.name }}</md-checkbox>

            <md-button class="md-raised md-primary" @click="saveLog">Save</md-button>
        </md-dialog>

        <div class="add">
            <md-button class="md-fab md-primary" @click="openDialog">
                <md-icon>add</md-icon>
            </md-button>
        </div>

        <div class="container">
            <md-list class="md-triple-line">
                <div v-for="n in 3" :key="n">
                    <md-list-item >
                        <md-avatar class="md-avatar-icon">M</md-avatar>
                        <div class="md-list-item-text">
                            <span>Matevz</span>
                            <span>40</span>
                            <p>Matevz, Zan</p>
                        </div>
                    </md-list-item>
                    <md-divider class="md-inset"></md-divider>
                </div>
            </md-list>
        </div>
    </div>
</template>

<script>
const USERNAME = 'matevz'


export default {
    name: 'App',
    data () {
        return {
            showDialog: false,
            amount: null,
            logs: [],
            availableUsernames: [],
        }
    },
    methods: {
        openDialog () {
            this.showDialog = true
        },
        saveLog () {
            const involvedUsernames = this.availableUsernames.filter(u => u.isInvolved).map(u => u.name)
            if (!involvedUsernames.length || !this.amount.length) return

            const newLog = this.logsGun.get(Date.now().toString())
            newLog.put({
                name: USERNAME,
                amount: this.amount,
                involved: involvedUsernames.join(',')
            })

            this.availableUsernames.filter(u => u.isInvolved).forEach(u => {
                // this.balanceGun.get(u.name)
                // this.balanceGun.get(u.name).set({ amount: parseInt(this.amount) / involvedUsernames.length })
            })

            this.balanceGun.get(USERNAME).set({ })

            this.name = null
            this.amount = null
            this.showDialog = false
            this.availableUsernames.forEach(u => u.isInvolved = false)
        },
        logsUpdated (log) {
            this.logs.push(log)
        },
        onNewUser (user) {
            if (!this.availableUsernames.some(u => u.name === user.username)) {
                this.availableUsernames.push({ name: user.username, isInvolved: false })
            }
        }
    },
    created () {
        this.logsGun = this.$gun.get('logs')
        this.usersGun = this.$gun.get('users')
        this.balanceGun = this.$gun.get('balance')

        this.usersGun.set({ username: USERNAME })
    
        this.logsGun.map().on(this.logsUpdated.bind(this))
        this.usersGun.map().on(this.onNewUser.bind(this))
    }
}
</script>

<style lang="less">
#app {
    min-height: 100vh;
    position: relative;
}

.container {
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    margin-top: 10px;
}

.add {
    position: absolute;
    right: 100px;
    bottom: 100px;
}

.dialog {
    padding: 10px;
}
</style>
