<template>
    <div>
        <input-label
            :id="id"
            :label="label"
            :required="required"
            :hidden="labelHidden"
        />
        <div class="relative rounded-md">
            <input
                v-if="!multiline"
                :id="id"
                v-model="model"
                class="form-input block w-full sm:text-sm sm:leading-5 transition"
                :class="{ 'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:ring-red-300': hasError }"
                :type="type"
                :placeholder="placeholder"
                :aria-invalid="hasError"
                :aria-labelledby="`${id}-label`"
                :aria-describedby="`${id}-error`"
                :required="required"
                v-bind="additionalProps"
                @input="onInput"
            >
            <textarea
                v-else
                :id="id"
                v-model="model"
                rows="3"
                class="form-textarea block w-full sm:text-sm sm:leading-5 transition duration-150 ease-in-out"
                :class="{ 'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:ring-red-300': hasError }"
                :placeholder="placeholder"
                :aria-invalid="hasError"
                :aria-labelledby="`${id}-label`"
                :aria-describedby="`${id}-error`"
                :required="required"
                @input="onInput"
            />
            <div
                v-if="hasError"
                class="absolute inset-y-0 right-0 pr-3 flex pointer-events-none"
                :class="[{ 'items-center': !multiline }, { 'mt-2': multiline }]"
            >
                <svg
                    class="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                    />
                </svg>
            </div>
        </div>
        <p
            v-if="hasDescription"
            :id="`${id}-description`"
            class="mt-1 text-sm text-gray-500"
        >
            {{ description }}
        </p>
        <p
            v-if="hasError"
            :id="`${id}-error`"
            class="mt-1 text-sm text-red-600"
        >
            {{ error }}
        </p>
    </div>
</template>

<script>
    import { Form } from 'laravel-request-utils';
    import InputLabel from './utils/InputLabel.vue';

    export default {
        name: 'TextInput',
        components: { InputLabel },
        props: {
            id: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                default: '',
            },
            labelHidden: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                default: 'text',
            },
            placeholder: {
                type: String,
                default: '',
            },
            modelValue: {
                type: [String, Number],
                default: '',
            },
            required: {
                type: Boolean,
                default: false,
            },
            description: {
                type: String,
                default: '',
            },
            multiline: {
                type: Boolean,
                default: false,
            },
            form: {
                type: Form,
                default: undefined,
            },
            step: {
                type: String,
                default: undefined,
            },
            min: {
                type: String,
                default: undefined,
            },
        },
        data() {
            return {
                model: '',
            };
        },
        computed: {
            hasError() {
                return typeof this.form !== 'undefined' ? this.form.errors.has(this.id) : false;
            },
            hasDescription() {
                return this.description.length > 0;
            },
            error() {
                return typeof this.form !== 'undefined' ? this.form.errors.get(this.id) : '';
            },
            additionalProps() {
                const props = {};
                ['step', 'min'].forEach((prop) => {
                    if (this[prop]) {
                        props[prop] = this[prop];
                    }
                });

                return props;
            },
        },
        watch: {
            modelValue(val) {
                this.model = val;
            },
        },
        methods: {
            onInput(event) {
                if (typeof this.form !== 'undefined') {
                    this.form.errors.clear(this.id);
                }
                this.$emit('update:modelValue', event.target.value);
            },
        },
    };
</script>
