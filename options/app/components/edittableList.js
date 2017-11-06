Vue.component('edittable-list', {
	template: `
		<div>
			<multiselect v-model="value" 
				:tag-placeholder="tagPlaceholder" 
				:placeholder="placeholder"
				:options="options" 
				:multiple="true" 
				:taggable="isEdittable"
				:close-on-select="shouldAutoClose"
				@tag="addEntry"
				@select="addEntry"
				@remove="modelUpdated"
				:options-limit="100"
				:block-keys="['Delete']"></multiselect>
		</div>
	`,
	props: ['value', 'options', 'tagPlaceholder', 'placeholder', 'edittable', 'autoClose'],
	data: function() {
		return {
			viewers: [],
			blockedKeys: ['Delete']
		};
	},
	computed: {
		isEdittable: function() {
			return this.edittable == null ? true : this.edittable;
		},
		shouldAutoClose: function() {
			return this.autoClose == null ? false : this.autoClose;
		}
	},
	methods: {
		addEntry: function(entry) {
			if(this.value.includes(entry)) return;
			this.value.push(entry);
			this.modelUpdated();
		},
		removeEntry: function(entry) {
			this.value = this.value.filter(e => e != entry);
			this.modelUpdated();
		},
		modelUpdated: function() {
			this.$emit('update:value', this.value);
			this.$emit('changed');
		}
	}
});