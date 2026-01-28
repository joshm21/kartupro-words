export const App = {
	setup() {
		const { ref, onMounted, nextTick } = Vue;

		const mockData = ref([]);
		const view = ref('categories');
		const transitionName = ref('slide-left');
		const currentCategory = ref(null);
		const currentSub = ref(null);
		const showSettings = ref(false);
		const settings = ref({ mode: 'English', audioEnabled: true });

		const studyOptions = ref([]);
		const currentPrompt = ref(null);
		const nextPrompt = ref(null);
		const preloadedAudio = ref(null);
		const feedback = ref({ item: null, correct: false });
		const roundCounter = ref(0);

		const viewDepth = { 'categories': 0, 'subcategories': 1, 'study': 2 };

		onMounted(async () => {
			try {
				const response = await fetch('data.json');
				mockData.value = await response.json();
			} catch (e) { console.error("Data load error. Ensure python server is running."); }
		});

		const navigate = (targetView) => {
			transitionName.value = viewDepth[targetView] < viewDepth[view.value] ? 'slide-right' : 'slide-left';
			view.value = targetView;

			// Clean up state after transition
			if (targetView === 'categories') {
				setTimeout(() => { currentCategory.value = null; currentSub.value = null; }, 400);
			} else if (targetView === 'subcategories') {
				setTimeout(() => { currentSub.value = null; }, 400);
			}
		};

		const setupStudyRound = () => {
			const list = currentSub.value[2];
			roundCounter.value++;

			// Cycle Prompt
			if (!currentPrompt.value) {
				currentPrompt.value = list[Math.floor(Math.random() * list.length)];
			} else if (nextPrompt.value) {
				currentPrompt.value = nextPrompt.value;
			}

			// Preload next audio
			nextPrompt.value = list[Math.floor(Math.random() * list.length)];
			if (settings.value.audioEnabled && nextPrompt.value[2]) {
				preloadedAudio.value = new Audio(nextPrompt.value[2]);
				preloadedAudio.value.preload = "auto";
			}

			// Get choices
			const distractorsPool = list.filter(item => item[1] !== currentPrompt.value[1]);
			const shuffledDistractors = distractorsPool.sort(() => 0.5 - Math.random()).slice(0, 5);
			const finalSelection = [...shuffledDistractors, currentPrompt.value];
			studyOptions.value = finalSelection.sort(() => 0.5 - Math.random());

			// Play audio
			if (settings.value.audioEnabled) playAudio(currentPrompt.value[2]);
		};

		const playAudio = (url) => {
			if (url && url.length > 5 && settings.value.audioEnabled) {
				new Audio(url).play().catch(() => {});
			}
		};

		return {
			mockData, view, transitionName, currentCategory, currentSub,
			showSettings, settings, studyOptions, currentPrompt,
			roundCounter, feedback, navigate, setupStudyRound, playAudio,
			getTranslation: (item) => {
				if (!item) return '';
				if (settings.value.mode === 'English') return item[3];
				if (settings.value.mode === 'Russian') return item[4];
				return '';
			},
			selectCategory: (cat) => { currentCategory.value = cat; navigate('subcategories'); },
			selectSub: (sub) => {
				currentSub.value = sub;
				currentPrompt.value = null;
				nextPrompt.value = null;
				setupStudyRound();
				navigate('study');
			},
			checkAnswer: (item) => {
				if (feedback.value.item) return;
				feedback.value = { item, correct: item === currentPrompt.value };
				setTimeout(() => {
					if (feedback.value.correct) setupStudyRound();
					feedback.value = { item: null, correct: false };
				}, 600);
			}
		};
	}
};
