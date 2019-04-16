<template>
    <div id="app">
        <md-dialog class="dialog" :md-active.sync="showDialog">
            <md-field>
                <label>Amount</label>
                <span class="md-prefix">$</span>
                <md-input class="md-layout-item" type="number" v-model="amount"></md-input>
            </md-field>

            <md-checkbox v-for="user in allUsers" :key="user.name" v-model="user.isInvolved">{{ user.name }}</md-checkbox>

            <md-button class="md-raised md-primary" @click="saveLog">Save</md-button>
        </md-dialog>

        <div class="add">
            <md-button class="md-fab md-primary" @click="openDialog">
                <md-icon>add</md-icon>
            </md-button>
        </div>

        <md-tabs @md-changed="changeTab">
            <md-tab id="logs" md-label="Logs"></md-tab>
            <md-tab id="balance" md-label="Balance"></md-tab>
        </md-tabs>

        <div v-if="activeTab === 'logs'" class="container">
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

        <div v-if="activeTab === 'balance'" class="container">
            <md-table v-model="users" md-card>
                <md-table-toolbar>
                    <h1 class="md-title">Users</h1>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                    <md-table-cell md-label="Balance" md-sort-by="balance">{{ item.balance }}$</md-table-cell>
                </md-table-row>
            </md-table>
        </div>
    </div>
</template>

<script>
const USERNAME = 'matevz'


export default {
    name: 'App',
    data () {
        return {
            activeTab: 'logs',
            showDialog: false,
            amount: null,
            logs: [],
            availableUsernames: [],
            users: [
                { name: 'a', balance: 40 },
                { name: 'a', balance: 40 },
                { name: 'a', balance: 40 },
            ]
        }
    },
    methods: {
        openDialog () {
            this.showDialog = true
        },
        saveLog () {
            const involvedUsernames = this.allUsers.filter(u => u.isInvolved).map(u => u.name)
            if (!involvedUsernames.length || !this.amount.length) return

            const newLog = this.logsGun.get(Date.now().toString())
            newLog.put({
                name: USERNAME,
                amount: this.amount,
                involved: involvedUsernames.join(',')
            })

            this.allUsers.filter(u => u.isInvolved).forEach(u => {
                // this.balanceGun.get(u.name)
                // this.balanceGun.get(u.name).set({ amount: parseInt(this.amount) / involvedUsernames.length })
            })

            this.balanceGun.get(USERNAME).set({ })

            this.name = null
            this.amount = null
            this.showDialog = false
            this.allUsers.forEach(u => u.isInvolved = false)
        },
        logsUpdated (log) {
            this.logs.push(log)
        },
        onNewUser (user) {
            if (!this.allUsers.some(u => u.name === user.username)) {
                this.allUsers.push({ name: user.username, isInvolved: false })
            }
        },
        changeTab (tab) {
            this.activeTab = tab
        }
    },
    created () {
        this.username = process.env.USERNAME

        this.logsGun = this.$gun.get('logs')
        this.usersGun = this.$gun.get('users')
        this.balanceGun = this.$gun.get('balance')

        this.allUsers.push({ name: this.username })
        this.usersGun.set({ username: this.username })
    
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
