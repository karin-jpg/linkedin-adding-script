async function AddConnections() {
    let results = await getResults();

    for (const person of results) {
        await addPerson(person);
    }
}

async function addPerson(person) {
    return new Promise(resolve => {
		clickButton(person).then(async () => {
			setTimeout(async () => {
				let addNoteButton = document.querySelector(".artdeco-modal__actionbar button[aria-label='Add a note']");
				console.log(addNoteButton);
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
            el.value = "Olá,\nGostaria de te adicionar na minha rede de contatos.\n\nAtenciosamente,\n\nMarcus Rodrigues https://github.com/Spartzed";
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
    }).splice(0, 1);
}

AddConnections();