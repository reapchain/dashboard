<template>
  <div>
    <div>
      <div
        style="{align-items: center; justify-content: space-between; display: flex;}"
      >
        <b-button-group class="mb-2">
          <b-button
            v-for="proposalStatus in proposalStatusOption"
            :key="proposalStatus.status"
            :variant="
              proposalStatus.status === type ? 'secondary' : 'outline-secondary'
            "
            @click="switchStatus(proposalStatus.status)"
            >{{ proposalStatus.name }}</b-button
          >
        </b-button-group>
        <b-button-group class="mb-2" style="margin-left: auto;">
          <b-button
            v-b-modal.operation-modal
            variant="primary"
            @click="setOperationModalType('GovProposal')"
          >
            New Proposal
          </b-button>
        </b-button-group>
      </div>
    </div>
    <b-row class="match-height">
      <b-col v-if="proposals.length < 1 && !loading">
        <div class="text-left pt-1">
          <h4>No {{ statusName }} Proposals</h4>
        </div>
      </b-col>
      <b-col v-for="p in proposals" :key="p.id" lg="6" md="12">
        <proposal-summary-component
          :p="p"
          :total-power="totalPower"
          :tally-param="tallyParam"
        />
      </b-col>
    </b-row>
    <b-row v-if="next">
      <b-col>
        <b-button
          block
          variant="outline-primary"
          :disabled="loading"
          @click="getList()"
        >
          Load More
        </b-button>
      </b-col>
    </b-row>
    <operation-modal
      :type="operationModalType"
      :proposal-id="selectedProposalId"
      :proposal-title="selectedTitle"
    />
    <div id="txevent" />
  </div>
</template>

<script>
import {
  BCardTitle,
  BCardFooter,
  BButton,
  BProgressBar,
  BProgress,
  BBadge,
  BTooltip,
  BRow,
  BCol,
  VBModal,
  BButtonGroup,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import OperationModal from "@/views/components/OperationModal/index.vue";
import ProposalSummaryComponent from "./components/governance/ProposalSummaryComponent.vue";
import store from "@/store";

export default {
  components: {
    BButton,
    BButtonGroup,
    BCardFooter,
    BProgressBar,
    BProgress,
    BBadge,
    BCardTitle,
    BTooltip,
    BRow,
    BCol,
    OperationModal,
    ProposalSummaryComponent,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      selectedProposalId: 0,
      selectedTitle: "",
      proposals: [],
      max: 1,
      operationModalType: "",
      next: "",
      totalPower: 0,
      tallyParam: null,
      proposalStatusOption: [
        { status: "2", name: "Voting" },
        { status: "1", name: "Deposit" },
        { status: "3", name: "Passed" },
        { status: "4", name: "Rejected" },
      ],
    };
  },
  created() {
    this.initial();
  },
  mounted() {
    const elem = document.getElementById("txevent");
    elem.addEventListener("txcompleted", () => {
      this.initial();
    });
  },
  computed: {
    type() {
      const myType = this.$route.query.status;
      return myType || "2";
    },
    statusName() {
      const myType = this.$route.query.status || "2";
      const myOption = this.proposalStatusOption.find(
        (ele) => ele.status === myType
      );

      return myOption ? myOption.name : "Active";
    },
  },
  methods: {
    initial() {
      this.$http.getGovernanceParameterTallying().then((res) => {
        this.tallyParam = res;
      });
      this.getList();
    },
    switchStatus(s) {
      if (!this.loading) {
        this.proposals = [];
        this.$router.replace({
          query: {
            status: s,
          },
        });
        this.getList();
      }
    },
    goNewProposalPage() {
      const c = store.state.chains.selected;
      this.$router.push({
        name: "newProposal",
        params: { chain: c.chain_name },
      });
    },
    getList() {
      this.loading = true;
      this.$http.getGovernanceListByStatus(this.type).then((res) => {
        // this.proposals = this.proposals.concat(res.proposals);
        this.proposals = res.proposals;
        this.updateTally(this.proposals);
        this.next = res.pagination.next_key;
        this.loading = false;
      });
    },
    updateTally(res) {
      this.$http.getStakingPool().then((pool) => {
        this.totalPower = pool.bondedToken;
        const voting = res.filter((i) => i.status === 2);
        if (voting.length > 0) {
          voting.forEach((p) =>
            this.$http.getGovernanceTally(p.id, 0).then((update) => {
              this.$set(p, "tally", update);
            })
          );
        }
      });
    },
    setOperationModalType(type) {
      this.operationModalType = type;
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  /* flex-wrap: nowrap; */
  justify-content: space-between;
}
.card {
  flex-basis: 49%;
}
.gov-wrapper {
  display: flex;
  justify-content: center;
}
.dark-layout .gov-wrapper .gov {
  background-color: #161d31;
}
.gov-wrapper .gov {
  padding: 0.5rem;
  margin: 0.3rem;
  min-width: 7.5rem;
  text-align: center;
  background-color: #f8f8f8;
  border-radius: 0.357rem;
}
</style>
