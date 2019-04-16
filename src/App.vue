<template>
    <div id="app">
        <md-dialog class="dialog" :md-active.sync="isDialogShown">
            <md-field>
                <label>Amount</label>
                <span class="md-prefix">$</span>
                <md-input class="md-layout-item" type="number" v-model="amount"></md-input>
            </md-field>

            <md-checkbox v-for="user in allUsers" :key="user.username" v-model="user.isInvolved">{{ user.username }}</md-checkbox>

            <md-button class="md-raised md-primary" @click="saveBill">Save</md-button>
        </md-dialog>

        <div class="add">
            <md-button class="md-fab md-primary" @click="openDialog">
                <md-icon>add</md-icon>
            </md-button>
        </div>

        <md-tabs @md-changed="changeTab">
            <md-tab id="bills" md-label="Bills"></md-tab>
            <md-tab id="balance" md-label="Balance"></md-tab>
        </md-tabs>

        <div v-if="activeTab === 'bills'" class="container">
            <md-toolbar>Your balance: {{ Math.round(balanceByUsername[username]) }}$</md-toolbar>
            <md-list class="md-triple-line">
                <div v-for="(bill, index) in bills" :key="index">
                    <md-list-item>
                        <md-avatar class="md-avatar-icon">{{ bill.username[0].toUpperCase() }}</md-avatar>
                        <div class="md-list-item-text">
                            <span>{{ bill.username }}</span>
                            <span>{{ bill.involved.length }} × {{ Math.round(bill.amount / bill.involved.length) }}$</span>
                            <p>{{ bill.involved.join(', ') }}</p>
                        </div>
                    </md-list-item>
                    <md-divider v-if="index < bills.length - 1" class="md-inset"></md-divider>
                </div>
            </md-list>
        </div>

        <div v-if="activeTab === 'balance'" class="container">
            <md-table v-model="allUsers" md-card>
                <md-table-toolbar>
                    <h1 class="md-title">Users</h1>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Name" md-sort-by="name">{{ item.username }}</md-table-cell>
                    <md-table-cell md-label="Balance" md-sort-by="balance">{{ Math.round(balanceByUsername[item.username]) }}$</md-table-cell>
                </md-table-row>
            </md-table>
        </div>
    </div>
</template>

<script>
const USERNAME = process.env.USERNAME || 'zan'

export default {
    data () {
        return {
            activeTab: 'bills',
            isDialogShown: false,
            amount: null,
            bills: [],
            allUsers: [],
        }
    },
    computed: {
        balanceByUsername () {
            let byUsername = {}
            this.allUsers.forEach(user => {
                let res = 0
                this.bills.forEach(bill => {
                    if (bill.username === user.username) {
                        res += bill.amount
                    }
                    if (bill.involved.includes(user.username)) {
                        res -= bill.amount / bill.involved.length
                    }
                })
                byUsername[user.username] = res
            })
            return byUsername
        },
    },
    methods: {
        openDialog () {
            this.isDialogShown = true
        },
        saveBill () {
            const involvedUsernames = this.allUsers.filter(u => u.isInvolved).map(u => u.username)
            if (!involvedUsernames.length || !this.amount.length) return

            this.billsGun.get(Date.now().toString()).put({
                username: USERNAME,
                amount: parseInt(this.amount),
                involved: involvedUsernames.join(',')
            })

            this.amount = null
            this.isDialogShown = false
            this.allUsers.forEach(u => u.isInvolved = false)
        },
        onNewBill (bill) {
            if (bill.username && (typeof bill.amount === 'number') && !isNaN(bill.amount) && bill.involved) {
                this.bills.splice(0, 0, {
                    username: bill.username,
                    amount: bill.amount,
                    involved: bill.involved.split(',')
                })
            }
        },
        onNewUser (user) {
            if (user.username.length > 0 && !this.allUsers.some(u => u.username === user.username)) {
                this.allUsers.push({ username: user.username, isInvolved: false })
            }
        },
        changeTab (tab) {
            this.activeTab = tab
        }
    },
    created () {
        this.username = USERNAME
        this.allUsers.push({ username: this.username })

        this.usersGun = this.$gun.get('users')
        this.usersGun.set({ username: this.username })
        this.usersGun.map().on(this.onNewUser.bind(this))
    
        this.billsGun = this.$gun.get('bills')
        this.billsGun.map().on(this.onNewBill.bind(this))
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
