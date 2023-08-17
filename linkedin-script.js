const MAXPAGES = 10;

async function AddConnections() {
	return new Promise(async resolve => {
		let results = await getResults();

		for (const person of results) {
			await addPerson(person);
		}

		resolve();	
	});
	
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
					resolve();
				}, 3000);
			}, 3000);
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
        console.log("carregou");
        try {
            AddConnections().then(async() => {
				let pagination = document.querySelector(".artdeco-pagination");
				let currentPage = pagination.querySelector(".active");
				let nextPage = currentPage.nextElementSibling;
				nextPage.querySelector("button").click();
	
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