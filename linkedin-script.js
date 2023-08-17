const MAXPAGES = 10;

async function AddConnections() {
	return new Promise(async resolve => {
		let results = await getResults();

		for (const person of results) {
			await addPerson(person);
		}
		resolve();
	})
	
}

async function addPerson(person) {
	return new Promise(resolve => {
		clickButton(person).then(async () => {
			setTimeout(async () => {
				let addNoteButton = document.querySelector(".artdeco-modal__actionbar button[aria-label='Add a note']");
				await sendMessage(addNoteButton);

				let sendButton = document.querySelector(".artdeco-modal__actionbar.ember-view button[aria-label='Send now']");
				setTimeout(async () => {
					await clickButton(sendButton);
				}, 600);
				resolve();
			}, 600);
		});
	});
}

async function sendMessage(button) {
	return new Promise(resolve => {
		button.click();
		setTimeout(() => {
			let el = document.querySelector("textarea[name='message']")
			el.value = " ";
			let evt = document.createEvent("Events");
			evt.initEvent("change", true, true);
			el.dispatchEvent(evt);
		}, 200);
		resolve();
	});
}

async function clickButton(button) {
	return new Promise(resolve => {
		button.click();
		resolve();
	});
}

async function getResults() {
	return [...document.querySelectorAll(".entity-result .artdeco-button")].filter(a => {
		return a.textContent.trim() === "Connect";
	});
}


async function changePage() {

	let iterations = 0;
	do {
		iterations++;
		let stateCheck = setInterval(async () => {
			if (document.readyState === 'complete') {
				console.log("carregou")
				clearInterval(stateCheck);
				AddConnections()
				.then(() => {
					let pagination = document.querySelector(".artdeco-pagination");
					let currentPage = pagination.querySelector(".active");
					let nextPage = currentPage.nextElementSibling;
					nextPage.querySelector("button").click()
				})
				
				
			}
		}, 100)
	} while (iterations < MAXPAGES);

}

changePage();