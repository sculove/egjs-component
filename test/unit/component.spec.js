import Component from "../../src/Component";

class TestClass extends Component {
	constructor(option) {
		super();
		this.options = Object.assign({}, option);
	}
}

function noop() {}

describe("Basic test", function() {
	var oClass;

    beforeEach(() => {
    	oClass = new TestClass();
    });

		it("should have options property", () => {
	    //Given
			//When
			const componntClass = new Component();
			//Then
			expect(componntClass.options).to.be.eql({});
    });

    it("When custom event added by on(), return value must be instance itself", () => {
	    //Given
		//When
		const returnVal = oClass.on("returnTest", noop);
		//Then
		expect(returnVal).to.deep.equal(oClass);
    });

    it("Add event handler by Object type", () => {
		//Given
		//When
		const returnVal = oClass.on({
			"test2" : noop,
			"test3" : noop
		});

		oClass.on({
			"test2" : noop,
			"test3" : noop
		});

		oClass.on('test3', noop);

		//Then
		expect(returnVal._eventHandler.test2.length).equal(2);
		expect(returnVal._eventHandler.test3.length).equal(3);
		expect(returnVal).to.deep.equal(oClass);
    });

    it("Add event handler by invalid type", () => {
		//Given
		function getPropertyCount(obj) {
			let count = 0;
			for(let prop in obj) {
				if(Object.prototype.hasOwnProperty.call(window, prop)) {
					// remove constructor (es6) in case of phantomjs
					if(prop !== "constructor") {
						count = count + 1;
					}
				}
			}
			return count;
		}
		//When
		const returnVal1 = oClass.on("test_string");
		const returnVal2 = oClass.on(123);
		const returnVal3 = oClass.on(true);
		const returnVal4 = oClass.on(noop);
		const returnVal5 = oClass.on({test: 123});

		//Then
		expect(getPropertyCount(returnVal1)).equal(0);
		expect(returnVal1).to.deep.equal(oClass);

		expect(getPropertyCount(returnVal2)).equal(0);
		expect(returnVal2).to.deep.equal(oClass);

		expect(getPropertyCount(returnVal3)).equal(0);
		expect(returnVal3).to.deep.equal(oClass);

		expect(getPropertyCount(returnVal4)).equal(0);
		expect(returnVal4).to.deep.equal(oClass);

		expect(getPropertyCount(returnVal5)).equal(0);
		expect(returnVal5).to.deep.equal(oClass);
    });
});

describe("on method", function() {
	var oClass;

    beforeEach(() => {
    	oClass = new TestClass();
    });

    it("Basic part", () => {
		//Given
		let oClass2 = oClass.on("customEvent", noop);
		//When
		const nHandlerLength = oClass._eventHandler["customEvent"].length;
		//Then
		expect(nHandlerLength).equal(1);
		expect(oClass2).to.deep.equal(oClass);
    });

    it("Re-attach after event detach by string type", () => {
		//Given
		//When
		oClass.on("customEvent", noop);
		oClass.on("customEvent", noop);
		oClass.off("customEvent");
		const oClass2 = oClass.on("customEvent", noop);
		//Then
		expect(oClass2._eventHandler.customEvent.length).equal(1);
		expect(oClass2._eventHandler.customEvent[0]).equal(noop);
    });

    it("Re-attach after event detach by string, function type", () => {
		//Given
		//When
		oClass.on("customEvent", noop);
		oClass.on("customEvent", noop);
		oClass.off("customEvent", noop);
		const oClass2 = oClass.on("customEvent", noop);
		//Then
		expect(oClass2._eventHandler.customEvent.length).equal(2);
		expect(oClass2._eventHandler.customEvent[0]).equal(noop);
		expect(oClass2._eventHandler.customEvent[1]).equal(noop);
    });

});

describe("off method", function() {
	var oClass;

    beforeEach(() => {
    	oClass = new TestClass();
    });

    it("Basic part", () => {
		//Given
		oClass.on("customEvent", noop);
		//When
		const oClass2 = oClass.off("customEvent", noop);
		const nHandlerLength = oClass._eventHandler["customEvent"].length;
		//Then
		expect(oClass2).equal(oClass);
		expect(nHandlerLength).equal(0);
    });

    it("Remove nonexistence event handler", () => {
		//Given
		oClass.on("test1", noop);
		//When
		let oClass2 = oClass.off("noevent", noop);
		//Then
		expect(oClass2._eventHandler.test1.length).equal(1);
		expect(oClass2).equal(oClass);
    });

    it("Remove all event handlers for same.", () => {
		//Given
		var allOffTestCount = 0;
		oClass.on("allOffTest",function(oCustomEvent){
			allOffTestCount++;
		});
		oClass.on("allOffTest",function(oCustomEvent){
			allOffTestCount++;
		});
		//When
		oClass.off("allOffTest");

		oClass.trigger("allOffTest");
		oClass.trigger("allOffTest");
		//Then
		expect(allOffTestCount).equal(0);
    });

    it("Remove all event handlers.", () => {
		//Given
		var allOffTestCount = 0;
		oClass.on("allOffTest",function(oCustomEvent){
			allOffTestCount++;
		});
		oClass.on("allOffTest",function(oCustomEvent){
			allOffTestCount++;
		});
		oClass.on("allOffTest2",function(oCustomEvent){
			allOffTestCount++;
		});
		oClass.on("allOffTest2",function(oCustomEvent){
			allOffTestCount++;
		});
		//When
		oClass.off();

		oClass.trigger("allOffTest");
		oClass.trigger("allOffTest2");
		//Then
		expect(allOffTestCount).equal(0);
    });
});

describe("trigger method", function() {
	var oClass;

    beforeEach(() => {
    	oClass = new TestClass();
    });

    it("Return value test for trigger method", () => {
		//Given
		//When
		let returnVal = oClass.trigger("noevent");
		//Then
		expect(returnVal).to.be.true;

		//Given
		oClass.on("test", noop);
		//When
		returnVal = oClass.trigger("test");
		//Then
		expect(returnVal).to.be.true;
    });

    it("Test for run trigger method", () => {
		//Given
		var oCustomEvent = { nValue : 3 };
		var param = [];
		oClass.on("test", function (oCustomEvent,a,b,c) {
			oCustomEvent.nValue = 100;
			param.push(a);
			param.push(b);
			param.push(c);
		});
		//When
		const parameterCheck = oClass.trigger("test", oCustomEvent, 1, 2, 3);
		//Then
		expect(oCustomEvent.nValue).equal(100);
		expect(param).to.eql([ 1, 2, 3 ]);
    });

    it("Check custom event", () => {
		//Given
		var eventType, stopType;
		oClass.on("eventType",function(oCustomEvent){
			eventType = oCustomEvent.eventType;
			stopType = typeof oCustomEvent.stop;
		});
		//When
		oClass.trigger("eventType");
		//Then
		expect(eventType).equal("eventType");
		expect(stopType).equal("function");
		});
	
		it("shouldn't call extended method when the Array is extends", () => {
		//Given
		Array.prototype.ExtendSomthing = sinon.spy();
		oClass.on("eventType", function() {});
		//When
		oClass.trigger("eventType");
		//Then
		expect(Array.prototype.ExtendSomthing.called).to.be.false;
		});
		delete Array.prototype.ExtendSomthing;
});

describe("stop method", function() {
	var oClass;

    beforeEach(() => {
    	oClass = new TestClass();
    });

    it("Basic test", () => {
		//Given
		oClass.on("test", function(oCustomEvent){
			oCustomEvent.stop();
		});
		//When
		const result = oClass.trigger("test");
		//Then
		expect(result).to.be.false;
    });

    it("Test for multiple event handler", () => {
		//Given
		oClass.on("test", (oCustomEvent)=>{
			oCustomEvent.stop();
		});
		oClass.on("test", noop);
		//When
		const result = oClass.trigger("test");
		//Then
		expect(result).to.be.false;
    });

});

describe("hasOn method", function() {
	var oClass;

    beforeEach(() => {
    	oClass = new TestClass();
    });

    it("Event existence/nonexistence", () => {
		//Given
		oClass.on("test", noop);
		//When
		const result = oClass.hasOn("test");
		//Then
		expect(result).to.be.true;

		//When
		const result2 = oClass.hasOn("test2");
		//Then
		expect(result2).to.be.false;
    });
});

describe("once method", function() {
	var oClass;

    beforeEach(() => {
		oClass = new TestClass({
			"foo": 1,
			"bar": 2
		});
    });

    it("once method should be fire event one time.", () => {
		//Given
		let callCount = 0;
		//When
		oClass.once("test",()=>{
			callCount++;
		});
		oClass.trigger("test");
		//Then
		expect(callCount).to.equal(1);

		//Given
		//When
		oClass.trigger("test");
		//Then
		expect(callCount).to.equal(1);
    });

    it("should be support object type.", () => {
		//Given
		let callCount = 0, callCount2 = 0;
		//When
		oClass.once({
			"test"(){
				callCount++;
			},
			"test2"(){
				callCount2++;
			}
		});
		oClass.trigger("test");
		oClass.trigger("test2");
		//Then
		expect(callCount).to.equal(1);
		expect(callCount2).to.equal(1);

		//Given
		//When
		oClass.trigger("test");
		oClass.trigger("test2");
		//Then
		expect(callCount).to.equal(1);
		expect(callCount2).to.equal(1);
    });

    it("should be recevied parameters", () => {
		//Given
		let callCount = 0, e, a = {"a":1}, b = {"b":1}, param1;
		oClass.once("test", (event, aa) => {
			callCount++;
			e = event;
			param1 = aa;
		});

		//When
		oClass.trigger("test", a, b);

		//Then
		expect(a.a).to.equal(e.a);
		expect(e.stop ).to.be.a('function');
		expect(b).to.equal(param1);
    });
});


