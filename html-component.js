



function Renderizar(){


	const data = {};
	component.$render(container, data);


}


// Extend the HTMLElement class to create the web component
class MyComponent extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor() {

		// Always call super first in constructor
		super();

		// Render HTML
		this.innerHTML = (function () {

			const xhr = new XMLHttpRequest();
			xhr.open("GET", "./components/component.html", false);
			xhr.send(null);

			const response = xhr.responseText;
			console.log('responde xhr', response);

			return response;


		})()


	}

	/**
	 * Runs each time the element is appended to or moved in the DOM
	 */
	connectedCallback() {
		console.log('connected!', this);
	}

	/**
	 * Runs when the element is removed from the DOM
	 */
	disconnectedCallback() {
		console.log('disconnected', this);
	}

}

// Define the new web component
if ('customElements' in window) {
	customElements.define('my-component', MyComponent);
}