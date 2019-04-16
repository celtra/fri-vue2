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

            <md-button class="md-raised md-primary" @click="saveLog">Save</md-button>
        </md-dialog>

        <md-button class="md-fab md-primary" @click="showDialog = true">
            <md-icon>add</md-icon>
        </md-button>

        <div v-for="log in logs" :key="`${log}-${Math.random()}`">{{ `${log.name}: ${log.amount}` }}</div>
    </div>
</template>

<script>

const logs = this.$gun.get('logs')
const username = 'matevz'

export default {
    name: 'App',
    data () {
        return {
            showDialog: false,
            name: null,
            amount: null,
            logs: []
        }
    },
    methods: {
        saveLog () {
            const newLog = logs.get(Date.now().toString())
            newLog.put({
                name: this.name,
                amount: this.amount
            })
            logs.set(newLog);
            this.name = null
            this.amount = null
            this.showDialog = false
        },
        logsUpdated (log) {
            this.logs.push(log)
        }
    },
    created () {
        logs.map().on(this.logsUpdated.bind(this));
    }
}
</script>

<style lang="less">

</style>
