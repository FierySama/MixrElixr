Vue.component('made-with-love', {
	template: `
        <span>
            <span class="made-with-love-wrapper">
                Made with <i class="fa fa-heart pound"></i> by the <a @click="showModal">Mixer community</a>
            </span>
            <b-modal id="teamModal"
                ref="teamModal"
                size="sm"
                title="The Team"
                hide-header="true"
                body-bg-variant="dark"
                body-text-variant="light"
                footer-bg-variant="dark"
                footer-text-variant="light"
                ok-only="true"
                @ok="hideModal">
                    <h5 class="modal-title">Contributors</h5>
                    <div class="teammember">ebiggz</div>
                    <div class="teammember">Firebottle</div>                
                    <div class="teammember">ThePerry</div>
                    <div class="teammember">Carlyndra</div>
                    <div class="teammember">Buttercup</div>
                    <div class="teammember">murfGUY</div>
                    <h5 class="modal-title" style="padding-top: 20px">Need Help?</h5>
                    <div style="font-size:16px">If you have questions, please reach out to us <a class="light-blue-link" href="https://twitter.com/MixrElixr" target="_blank">on Twitter</a> or post in the #elixr-help channel of <a class="light-blue-link" href="https://discord.gg/2CGrbA4" target="_blank">our Discord</a>.</div>
                    <div class="disclaimer">MixrElixr is neither created nor endorsed by Mixer or Microsoft. It is created by the community for the community.</div>
                    <div slot="modal-footer" style="text-align: center; width: 100%;">
                        <b-btn variant="primary" @click="hideModal">Ok</b-btn>
                    </div>
            </b-modal>
        </span>        
    `,
	methods: {
		showModal: function() {
			this.$refs.teamModal.show();
		},
		hideModal: function() {
			this.$refs.teamModal.hide();
		}
	}
});