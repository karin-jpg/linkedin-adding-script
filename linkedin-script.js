const MAXPAGES = 10;

async function AddConnections() {
	return new Promise(async resolve => {
		let results = await getResults();

		if (results.length == 0) {
			return resolve();
		}

		for (const person of results) {
			window.scrollTo(0, document.body.scrollHeight);
			await addPerson(person);
		}

		resolve();	
	});
	
}

async function addPerson(person) {
	return new Promise(resolve => {
		clickButton(person).then(async () => {
			setTimeout(async () => {

				let isEmailRequired = await validateEmailRequest();
				console.log(isEmailRequired)
				if (isEmailRequired) {
					document.querySelector("button[aria-label='Dismiss']").click();
					resolve();
				}

				let addNoteButton = document.querySelector(".artdeco-modal__actionbar button[aria-label='Add a note']");
				await sendMessage(addNoteButton);

				let sendButton = document.querySelector(".artdeco-modal__actionbar.ember-view button[aria-label='Send now']");
				setTimeout(async () => {
					await clickButton(sendButton);
					resolve();
				}, 3000);
			}, 3000);
		});
	});
}

async function validateEmailRequest() {
	let emailLabel = document.querySelector("label[for='email']");
	
	return (emailLabel != null)
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
		}, 2000);
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

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function changePage(iterations = 0) {
	if (iterations >= MAXPAGES) {
		console.log("Completed all pages");
		return;
	}

	if (document.readyState === 'complete') {
		try {
			AddConnections().then(async() => {
				let pagination = document.querySelector(".artdeco-pagination");
				let nextButton = pagination.querySelector("button[aria-label='Next']")
				nextButton.click();
				await sleep(2000);
				await changePage(iterations + 1);
			});

		} catch (error) {
			console.error("Error processing page:", error);
		}
	} else {
		await sleep(2000);
		await changePage(iterations);
	}
}

changePage();