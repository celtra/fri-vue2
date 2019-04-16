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
            ${{ balanceByUsername[username] }}
            <md-list class="md-triple-line">
                <div v-for="(log, index) in logs" :key="index">
                    <md-list-item >
                        <md-avatar class="md-avatar-icon">{{ log.name[0].toUpperCase() }}</md-avatar>
                        <div class="md-list-item-text">
                            <span>{{ log.name }}</span>
                            <span>{{ log.amount }}</span>
                            <p>{{ log.involved.join(', ') }}</p>
                        </div>
                    </md-list-item>
                    <md-divider class="md-inset"></md-divider>
                </div>
            </md-list>
        </div>

        <div v-if="activeTab === 'balance'" class="container">
            <md-table v-model="allUsers" md-card>
                <md-table-toolbar>
                    <h1 class="md-title">Users</h1>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                    <md-table-cell md-label="Balance" md-sort-by="balance">{{ balanceByUsername[item.name] }}$</md-table-cell>
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
            allUsers: [],
            users: [
                { name: 'a', balance: 40 },
                { name: 'a', balance: 40 },
                { name: 'a', balance: 40 },
            ]
        }
    },
    computed: {
        balanceByUsername () {
            let byUsername = {}
            this.allUsers.forEach(user => {
                let res = 0
                this.logs.forEach(log => {
                    if (log.name === user.name) {
                        res += log.amount
                    }
                    if (log.involved.includes(user.name)) {
                        res -= log.amount / log.involved.length
                    }
                })
                byUsername[user.name] = res
            })
            return byUsername
        },
    },
    methods: {
        openDialog () {
            this.showDialog = true
        },
        saveLog () {
            const involvedUsernames = this.allUsers.filter(u => u.isInvolved).map(u => u.name)
            if (!involvedUsernames.length || !this.amount.length) return

            this.logsGun.get(Date.now().toString()).put({
                name: USERNAME,
                amount: parseInt(this.amount),
                involved: involvedUsernames.join(',')
            })

            this.name = null
            this.amount = null
            this.showDialog = false
            this.allUsers.forEach(u => u.isInvolved = false)
        },
        onNewLog (log) {
            if (log.name && (typeof log.amount === 'number') && !isNaN(log.amount) && log.involved) {
                this.logs.splice(0, 0, {
                    name: log.name,
                    amount: log.amount,
                    involved: log.involved.split(',')
                })
            }
        },
        onNewUser (user) {
            if (user.username.length > 0 && !this.allUsers.some(u => u.name === user.username)) {
                this.allUsers.push({ name: user.username, isInvolved: false })
            }
        },
        changeTab (tab) {
            this.activeTab = tab
        }
    },
    created () {
        this.username = USERNAME
        this.allUsers.push({ name: this.username })

        this.usersGun = this.$gun.get('users')
        this.usersGun.set({ username: this.username })
        this.usersGun.map().on(this.onNewUser.bind(this))
    
        this.logsGun = this.$gun.get('logs')
        this.logsGun.map().on(this.onNewLog.bind(this))
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
    position: fixed;
    right: 50px;
    bottom: 40px;
}

.dialog {
    padding: 10px;
}
</style>
