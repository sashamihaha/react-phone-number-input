'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _libphonenumberJs = require('libphonenumber-js');

var _inputFormat = require('input-format');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactResponsiveUi = require('./react-responsive-ui');

var _countryNames = require('./country names.json');

var _countryNames2 = _interopRequireDefault(_countryNames);

var _internationalIcon = require('./international icon');

var _internationalIcon2 = _interopRequireDefault(_internationalIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// A list of all country codes
var all_countries = [];

// Country code to country name map


// Not importing here directly from `react-responsive-ui` npm package
// just to reduce the overall bundle size.
var default_dictionary = {
	International: 'International'
};

// Populate `all_countries` and `default_dictionary`
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	for (var _iterator = (0, _getIterator3.default)(_countryNames2.default), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var item = _step.value;

		var _item = (0, _slicedToArray3.default)(item, 2);

		var code = _item[0];
		var name = _item[1];


		all_countries.push(code.toUpperCase());
		default_dictionary[code.toUpperCase()] = name;
	}

	// Default country flag icon
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
}

var FlagComponent = function FlagComponent(_ref) {
	var countryCode = _ref.countryCode;
	var flagsPath = _ref.flagsPath;
	return _react2.default.createElement('img', {
		className: 'react-phone-number-input__icon',
		src: '' + flagsPath + countryCode.toLowerCase() + '.svg' });
};

// Allows passing custom `libphonenumber-js` metadata
// to reduce the overall bundle size.

var Input = function (_Component) {
	(0, _inherits3.default)(Input, _Component);

	function Input(props) {
		(0, _classCallCheck3.default)(this, Input);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Input.__proto__ || (0, _getPrototypeOf2.default)(Input)).call(this, props));

		_initialiseProps.call(_this);

		var _this$props = _this.props;
		var countries = _this$props.countries;
		var value = _this$props.value;
		var dictionary = _this$props.dictionary;
		var international = _this$props.international;
		var internationalIcon = _this$props.internationalIcon;
		var flags = _this$props.flags;
		var country = _this.props.country;

		// Normalize `country` code

		country = normalize_country_code(country);

		// Autodetect country if value is set
		// and is international (which it should be)
		if (value && value[0] === '+') {
			// `country` will be left `undefined` in case of non-detection
			country = (0, _libphonenumberJs.parse)(value).country;
		}

		// If there will be no "International" option
		// then a `country` must be selected.
		if (!should_add_international_option(_this.props) && !country) {
			country = countries[0];
		}

		// Set the currently selected country
		_this.state.country_code = country;

		// If a phone number `value` is passed then format it
		if (value) {
			// `this.state.value_property` is the `this.props.value`
			// which corresponding to `this.state.value`.
			// It is being compared in `componentWillReceiveProps()`
			// against `newProps.value` to find out if the new `value` property
			// needs `this.state.value` recalculation.
			_this.state.value_property = value;
			// Set the currently entered `value`.
			// State `value` is either in international plaintext or just plaintext format.
			// (e.g. `+78005553535`, `1234567`)
			_this.state.value = _this.get_input_value_depending_on_the_country_selected(value, country);
		}

		// `<Select/>` options
		_this.select_options = [];

		// Whether custom country names are supplied
		var using_custom_country_names = false;

		// Add a `<Select/>` option for each country
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = (0, _getIterator3.default)(countries), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var country_code = _step2.value;

				if (dictionary[country_code]) {
					using_custom_country_names = true;
				}

				_this.select_options.push({
					value: country_code,
					label: dictionary[country_code] || default_dictionary[country_code],
					icon: get_country_option_icon(country_code, _this.props)
				});
			}

			// Sort the list of countries alphabetically
			// (if `String.localeCompare` is available).
			// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
			// (Which means: IE >= 11, and does not work in Safari as of May 2017)
			//
			// This is only done when custom country names
			// are supplied via `dictionary` property
			// because by default all country names are already sorted.
			//
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		if (using_custom_country_names && String.prototype.localeCompare) {
			_this.select_options.sort(function (a, b) {
				return a.label.localeCompare(b.label);
			});
		}

		// Add the "International" option to the country list (if suitable)
		if (should_add_international_option(_this.props)) {
			_this.select_options.unshift({
				label: dictionary['International'] || default_dictionary['International'],
				icon: flags === false ? undefined : internationalIcon
			});
		}
		return _this;
	}

	// Determines the text `<input/>` `value`
	// depending on `this.props.value` and the country selected.
	//
	// E.g. when a country is selected and `this.props.value`
	// is in international format for this country
	// then it can be converted to national format
	// (if `convertToNational` is `true`).
	//


	(0, _createClass3.default)(Input, [{
		key: 'get_input_value_depending_on_the_country_selected',
		value: function get_input_value_depending_on_the_country_selected(value, country_code) {
			var _props = this.props;
			var metadata = _props.metadata;
			var convertToNational = _props.convertToNational;


			if (!value) {
				return;
			}

			// If the country code is specified
			if (country_code) {
				// and the phone is in international format
				// and should convert to national phone number
				if (value[0] === '+' && convertToNational) {
					// If it's a fully-entered phone number
					// that converts into a valid national number for this country
					// then the value is set to be that national number.

					var parsed = (0, _libphonenumberJs.parse)(value, metadata);

					if (parsed.country === country_code) {
						var input_value = (0, _libphonenumberJs.format)(parsed.phone, country_code, 'National', metadata);
						return this.format(input_value, country_code).text;
					}
				}
			}
			// The country is not set.
			// Must be an international phone number then.
			else if (value[0] !== '+') {
					// The following causes the caret to move the end of the input field
					// but it's unlikely any sane person would like to erase the `+` sign
					// while inputting an international phone number without any country selected.
					return '+' + value;
				}

			return value;
		}
	}, {
		key: 'set_country_code_value',
		value: function set_country_code_value(country_code) {
			var onCountryChange = this.props.onCountryChange;


			if (onCountryChange) {
				onCountryChange(country_code);
			}

			this.setState({ country_code: country_code });
		}

		// `<select/>` `onChange` handler


		// `input-format` `parse` character function
		// https://github.com/catamphetamine/input-format


		// `input-format` `format` function
		// https://github.com/catamphetamine/input-format


		// Returns `true` if the country is available in the list


		// Can be called externally


		// `<input/>` `onKeyDown` handler


		// `<input/>` `onChange` handler.
		// Updates `this.props.value` (in e.164 phone number format)
		// according to the new `this.state.value`.
		// (keeps them in sync)


		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the parsed `value` in its `onBlur` handler,
		// not the formatted one.
		// A developer is not supposed to pass this `onBlur` property manually.
		// Instead, `redux-form` passes `onBlur` to this component automatically
		// and this component passes this `onBlur` property further to
		// `input-format`'s `<ReactInput/>` which then modifies this `onBlur` handler
		// to return the correct parsed `value` so that it all works with `redux-form`.


		// When country `<select/>` is toggled


		// Focuses the `<input/>` field
		// on tab out of the country `<select/>`

	}, {
		key: 'can_change_country',


		// Can a user change the default country or not.
		value: function can_change_country() {
			var countries = this.props.countries;

			// If `countries` is empty,
			// then only "International" option is available,
			// so can't switch it.
			//
			// If `countries` is a single allowed country,
			// then cant's switch it.
			//

			return countries.length > 1;
		}

		// Listen for default country property:
		// if it is set after the page loads
		// and the user hasn't selected a country yet
		// then select the default country.

	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(new_props) {
			var _props2 = this.props;
			var countries = _props2.countries;
			var value = _props2.value;

			// Normalize `country` codes

			var country = normalize_country_code(this.props.country);
			var new_country = normalize_country_code(new_props.country);

			// If the default country changed
			// (e.g. in case of IP detection)
			if (new_country !== country) {
				// If the phone number input field is currently empty
				// (e.g. not touched yet) then change the selected `country`
				// to the newly passed one (e.g. as a result of a GeoIP query)
				if (!value) {
					// If the passed `country` allowed then update it
					if (countries.indexOf(new_country) !== -1) {
						// Set the new `country`
						this.set_country(new_country, false);
					}
				}
			}

			// This code is executed:
			// * after `this.props.onChange(value)` is called
			// * if the `value` was externally set (e.g. cleared)
			if (new_props.value !== value) {
				// `this.state.value_property` is the `this.props.value`
				// which corresponding to `this.state.value`.
				// It is being compared in `componentWillReceiveProps()`
				// against `newProps.value` to find out if the new `value` property
				// needs `this.state.value` recalculation.
				// This is an optimization, it's like `shouldComponentUpdate()`.
				// This is supposed to save some CPU cycles, maybe not much, I didn't check.
				// Or maybe there was some other reason for this I don't remember now.
				if (new_props.value !== this.state.value_property) {
					// Update the `value` because it was externally set

					// Country code gets updated too
					var country_code = this.state.country_code;

					// Autodetect country if `value` is set
					// and is international (which it should be)
					if (new_props.value && new_props.value[0] === '+') {
						// `parse().country` will be `undefined` in case of non-detection
						country_code = (0, _libphonenumberJs.parse)(new_props.value).country || country_code;
					}

					this.setState({
						country_code: country_code,
						value: this.get_input_value_depending_on_the_country_selected(new_props.value, country_code),
						// `this.state.value_property` is the `this.props.value`
						// which corresponding to `this.state.value`.
						// It is being compared in `componentWillReceiveProps()`
						// against `newProps.value` to find out if the new `value` property
						// needs `this.state.value` recalculation.
						value_property: new_props.value
					});
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _props3 = this.props;
			var saveOnIcons = _props3.saveOnIcons;
			var showCountrySelect = _props3.showCountrySelect;
			var nativeExpanded = _props3.nativeExpanded;
			var disabled = _props3.disabled;
			var autoComplete = _props3.autoComplete;
			var selectTabIndex = _props3.selectTabIndex;
			var selectMaxItems = _props3.selectMaxItems;
			var inputTabIndex = _props3.inputTabIndex;
			var style = _props3.style;
			var selectStyle = _props3.selectStyle;
			var inputStyle = _props3.inputStyle;
			var className = _props3.className;
			var inputClassName = _props3.inputClassName;
			var dictionary = _props3.dictionary;
			var countries = _props3.countries;
			var country = _props3.country;
			var onCountryChange = _props3.onCountryChange;
			var flags = _props3.flags;
			var flagComponent = _props3.flagComponent;
			var flagsPath = _props3.flagsPath;
			var international = _props3.international;
			var internationalIcon = _props3.internationalIcon;
			var convertToNational = _props3.convertToNational;
			var metadata = _props3.metadata;
			var input_props = (0, _objectWithoutProperties3.default)(_props3, ['saveOnIcons', 'showCountrySelect', 'nativeExpanded', 'disabled', 'autoComplete', 'selectTabIndex', 'selectMaxItems', 'inputTabIndex', 'style', 'selectStyle', 'inputStyle', 'className', 'inputClassName', 'dictionary', 'countries', 'country', 'onCountryChange', 'flags', 'flagComponent', 'flagsPath', 'international', 'internationalIcon', 'convertToNational', 'metadata']);
			var _state = this.state;
			var value = _state.value;
			var country_code = _state.country_code;
			var country_select_is_shown = _state.country_select_is_shown;

			// `type="tel"` was reported to have issues with
			// Samsung keyboards caret position on Android OS.
			// https://github.com/catamphetamine/react-phone-number-input/issues/59
			// Therefore it's `type="text"` now which discards the
			// built-in phone number autocomplete feature in web-browsers.

			var markup = _react2.default.createElement(
				'div',
				{
					style: style,
					className: (0, _classnames2.default)('react-phone-number-input', className) },
				showCountrySelect && this.can_change_country() && _react2.default.createElement(_reactResponsiveUi.Select, {
					ref: this.store_select_instance,
					value: country_code,
					options: this.select_options,
					onChange: this.set_country,
					disabled: disabled,
					onToggle: this.country_select_toggled,
					onTabOut: this.on_country_select_tab_out,
					nativeExpanded: nativeExpanded,
					autocomplete: true,
					autocompleteShowAll: true,
					maxItems: selectMaxItems,
					concise: true,
					tabIndex: selectTabIndex,
					focusUponSelection: false,
					saveOnIcons: saveOnIcons,
					name: input_props.name ? input_props.name + '__country' : undefined,
					style: selectStyle,
					className: (0, _classnames2.default)('react-phone-number-input__country', {
						'react-phone-number-input__country--native-expanded': nativeExpanded
					}),
					inputClassName: inputClassName }),
				!country_select_is_shown && _react2.default.createElement(_inputFormat.ReactInput, (0, _extends3.default)({}, input_props, {
					ref: this.store_input_instance,
					value: value,
					onChange: this.on_change,
					onBlur: this.on_blur,
					disabled: disabled,
					autoComplete: autoComplete,
					tabIndex: inputTabIndex,
					parse: this.parse_character,
					format: this.format,
					onKeyDown: this.on_key_down,
					style: inputStyle,
					className: (0, _classnames2.default)('rrui__input', 'rrui__input-field', 'react-phone-number-input__phone', inputClassName) }))
			);

			return markup;
		}
	}]);
	return Input;
}(_react.Component);

// Parses a partially entered phone number
// and returns the national number so far.
// Not using `libphonenumber-js`'s `parse`
// function here because `parse` only works
// when the number is fully entered,
// and this one is for partially entered number.


Input.propTypes = {
	// Phone number `value`.
	// Is a plaintext international phone number
	// (e.g. "+12223333333" for USA)
	value: _propTypes2.default.string,

	// This handler is called each time
	// the phone number <input/> changes its textual value.
	onChange: _propTypes2.default.func.isRequired,

	// This `onBlur` interceptor is a workaround for `redux-form`,
	// so that it gets the parsed `value` in its `onBlur` handler,
	// not the formatted one.
	// A developer is not supposed to pass this `onBlur` property manually.
	// Instead, `redux-form` passes `onBlur` to this component automatically
	// and this component passes this `onBlur` property further to
	// `input-format`'s `<ReactInput/>` which then modifies this `onBlur` handler
	// to return the correct parsed `value` so that it all works with `redux-form`.
	onBlur: _propTypes2.default.func,

	// Set `onKeyDown` handler.
	// Can be used in special cases to handle e.g. enter pressed
	onKeyDown: _propTypes2.default.func,

	// Disables both the <input/> and the <select/>
	// (is `false` by default)
	disabled: _propTypes2.default.bool.isRequired,

	// Remembers the input and also autofills it
	// with a previously remembered phone number.
	// Default value: "tel".
	//
	// https://developers.google.com/web/updates/2015/06/checkout-faster-with-autofill
	//
	// "So when should you use autocomplete="off"?
	//  One example is when you've implemented your own version
	//  of autocomplete for search. Another example is any form field
	//  where users will input and submit different kinds of information
	//  where it would not be useful to have the browser remember
	//  what was submitted previously".
	//
	autoComplete: _propTypes2.default.string.isRequired,

	// Two-letter country code
	// to be used as the default country
	// for local (non-international) phone numbers.
	country: _propTypes2.default.string,

	// Is called when the selected country changes
	// (either by a user manually, or by autoparsing
	//  an international phone number being input).
	// This handler does not need to update the `country` property.
	// It's simply a listener for those who might need that for whatever purpose.
	onCountryChange: _propTypes2.default.func,

	// Localization dictionary:
	// `{ International: 'Международный', RU: 'Россия', US: 'США', ... }`
	dictionary: _propTypes2.default.objectOf(_propTypes2.default.string),

	// An optional list of allowed countries
	countries: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,

	// Custom national flag icons
	flags: _propTypes2.default.oneOfType([_propTypes2.default.bool,
	// Legacy behaviour, will be removed
	// in some future major version upgrade.
	_propTypes2.default.objectOf(_propTypes2.default.element)]),

	// Flag icon component
	flagComponent: _propTypes2.default.func.isRequired,

	// A base URL path for national flag SVG icons.
	// By default it uses the ones from `flag-icon-css` github repo.
	flagsPath: _propTypes2.default.string.isRequired,

	// Whether to use native `<select/>` when expanded
	nativeExpanded: _propTypes2.default.bool.isRequired,

	// If set to `false`, then country flags will be shown
	// for all countries in the options list
	// (not just for selected country).
	saveOnIcons: _propTypes2.default.bool.isRequired,

	// Whether to show country `<Select/>`
	// (is `true` by default)
	showCountrySelect: _propTypes2.default.bool.isRequired,

	// Whether to add the "International" option
	// to the list of countries.
	international: _propTypes2.default.bool,

	// Custom "International" phone number type icon.
	internationalIcon: _propTypes2.default.element.isRequired,

	// Should the initially passed phone number `value`
	// be converted to a national phone number for its country.
	// (is `false` by default)
	convertToNational: _propTypes2.default.bool.isRequired,

	// HTML `tabindex` attribute for the country select
	selectTabIndex: _propTypes2.default.number,

	// Defines the height of the dropdown country select list
	selectMaxItems: _propTypes2.default.number,

	// HTML `tabindex` attribute for the phone number input
	inputTabIndex: _propTypes2.default.number,

	// CSS style object
	style: _propTypes2.default.object,

	// Inline CSS styles for country `<select/>`
	selectStyle: _propTypes2.default.object,

	// Inline CSS styles for phone number `<input/>`
	inputStyle: _propTypes2.default.object,

	// Component CSS class
	className: _propTypes2.default.string,

	// `<input/>` CSS class
	// (both for the phone number `<input/>` and the autocomplete `<input/>`)
	inputClassName: _propTypes2.default.string,

	// `libphonenumber-js` metadata
	metadata: _propTypes2.default.shape({
		country_phone_code_to_countries: _propTypes2.default.object.isRequired,
		countries: _propTypes2.default.object.isRequired
	}).isRequired
};
Input.defaultProps = {
	// Is enabled
	disabled: false,

	// Remember (and autofill) as a phone number
	autoComplete: 'tel',

	// Include all countries by default
	countries: all_countries,

	// Flag icon component
	flagComponent: FlagComponent,

	// By default use the ones from `flag-icon-css` github repo.
	flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/',

	// Default international icon (globe)
	internationalIcon: _react2.default.createElement(
		'div',
		{ className: 'react-phone-number-input__icon react-phone-number-input__icon--international' },
		_react2.default.createElement(_internationalIcon2.default, null)
	),

	// Custom country names
	dictionary: {},

	// Whether to use native `<select/>` when expanded
	nativeExpanded: false,

	// Don't show flags for all countries in the options list
	// (show it just for selected country).
	// (to save user's traffic because all flags are about 3 MegaBytes)
	saveOnIcons: true,

	// Show country `<Select/>` by default
	showCountrySelect: true,

	// Don't convert the initially passed phone number `value`
	// to a national phone number for its country.
	// The reason is that the newer generation grows up when
	// there are no stationary phones and therefore everyone inputs
	// phone numbers with a `+` in their smartphones so local phone numbers
	// should now be considered obsolete.
	convertToNational: false
};

var _initialiseProps = function _initialiseProps() {
	var _this2 = this;

	this.state = {};

	this.set_country = function (country_code, focus) {
		var _props4 = _this2.props;
		var metadata = _props4.metadata;
		var convertToNational = _props4.convertToNational;

		// Previously selected country

		var previous_country_code = _this2.state.country_code;

		_this2.set_country_code_value(country_code);

		// Adjust the phone number (`value`)
		// according to the selected `country_code`

		var value = _this2.state.value;

		// If the `value` property holds any digits already

		if (value) {
			// If switching to a country from International or another country
			if (country_code) {
				// If the phone number was entered in international format.
				// The phone number may be incomplete.
				// The phone number entered not necessarily starts with
				// the previously selected country phone prefix.
				if (value[0] === '+') {
					// If the international phone number already contains
					// any country phone code then trim the country phone code part.
					// (that also could be the newly selected country phone code prefix)
					value = strip_country_phone_code(value, metadata);

					// Else just trim the + sign
					if (value[0] === '+') {
						value = value.slice('+'.length);
					}

					// Prepend country phone code part if `convertToNational` is not set
					if (!convertToNational) {
						value = '+' + (0, _libphonenumberJs.getPhoneCode)(country_code) + value;
					}
				}
			}

			// If switching to International from a country
			if (previous_country_code && !country_code) {
				// If no leading `+` sign
				if (value[0] !== '+') {
					// Format the local phone number as an international one.
					// The phone number entered not necessarily even starts with
					// the previously selected country phone prefix.
					// Even if the phone number belongs to whole another country
					// it will still be parsed into some national phone number.
					var national_number = parse_partial_number(value, previous_country_code, metadata).national_number;
					value = (0, _libphonenumberJs.format)(national_number, previous_country_code, 'International_plaintext', metadata);
				}
			}

			// Update the adjusted `<input/>` `value`
			// and update `this.props.value` (in e.164 phone number format)
			// according to the new `this.state.value`.
			// (keep them in sync)
			_this2.on_change(value, country_code, true);
		}
		// Disabling this feature because if a user selects a country
		// then it means he doesn't know how to input his phone number
		// in international format therefore not forcing it
		// by prepending `+${getPhoneCode(country_code)}`.
		//
		// else
		// {
		// 	// If the `value` property is `undefined`
		// 	// (which means the `<input/>` is either empty
		// 	//  or just the country phone code part is entered)
		// 	// and `convertToNational` wasn't set to `true`
		// 	// then populate `<input/>` with the selected country
		// 	// phone code prefix.
		// 	if (!convertToNational && country_code)
		// 	{
		// 		// Update the adjusted `<input/>` `value`
		// 		// and update `this.props.value` (in e.164 phone number format)
		// 		// according to the new `this.state.value`.
		// 		// (keep them in sync)
		// 		this.on_change(`+${getPhoneCode(country_code)}`, country_code, true)
		// 	}
		// }

		// Focus the phone number input upon country selection
		// (do it in a timeout because the `<input/>`
		//  is hidden while selecting a country)
		if (focus !== false) {
			setTimeout(_this2.focus, 0);
		}
	};

	this.parse_character = function (character, value) {
		var countries = _this2.props.countries;


		if (character === '+') {
			// Only allow a leading `+`
			if (!value) {
				// If the "International" option is available
				// then allow the leading `+` because it's meant to be this way.
				//
				// Otherwise, the leading `+` will either erase all subsequent digits
				// (if they're not appropriate for the selected country)
				// or the subsequent digits (if any) will join the `+`
				// forming an international phone number. Because a user
				// might be comfortable with entering an international phone number
				// (i.e. with country code) rather than the local one.
				// Therefore such possibility is given.
				//
				return character;
			}
		}
		// For digits
		else if (character >= '0' && character <= '9') {
				var metadata = _this2.props.metadata;
				var country_code = _this2.state.country_code;

				// If the "International" option is not available
				// and if the value has a leading `+`
				// then it means that the phone number being entered
				// is an international one, so only allow the country phone code
				// for the selected country to be entered.

				if (!should_add_international_option(_this2.props) && value && value[0] === '+') {
					if (!could_phone_number_belong_to_country(value + character, country_code, metadata)) {
						return;
					}
				}

				return character;
			}
	};

	this.format = function (input_text) {
		var country_code = arguments.length <= 1 || arguments[1] === undefined ? _this2.state.country_code : arguments[1];
		var metadata = _this2.props.metadata;

		// "As you type" formatter

		var formatter = new _libphonenumberJs.as_you_type(country_code, metadata);

		// Is used to check if a country code can already be derived
		_this2.formatter = formatter;

		// Format phone number
		var text = formatter.input(input_text);

		return { text: text, template: formatter.template };
	};

	this.is_selectable_country = function (country_code) {
		var countries = _this2.props.countries;
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {

			for (var _iterator3 = (0, _getIterator3.default)(countries), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var available_country_code = _step3.value;

				if (available_country_code === country_code) {
					return true;
				}
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}
	};

	this.focus = function () {
		_reactDom2.default.findDOMNode(_this2.input).focus();
	};

	this.on_key_down = function (event) {
		var onKeyDown = _this2.props.onKeyDown;

		// Expand country `<select/>`` on "Down arrow" key press

		if (event.keyCode === 40) {
			_this2.select.toggle();
		}

		if (onKeyDown) {
			onKeyDown(event);
		}
	};

	this.on_change = function (value) {
		var country_code = arguments.length <= 1 || arguments[1] === undefined ? _this2.state.country_code : arguments[1];
		var changed_country = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
		var _props5 = _this2.props;
		var metadata = _props5.metadata;
		var onChange = _props5.onChange;

		// If the `<input/>` is empty then just exit

		if (!value) {
			return _this2.setState({
				// State `value` is the parsed input value
				// (e.g. `+78005553535`, `1234567`).
				// This is not `this.props.value`
				// i.e. it's not neccessarily an international plaintext phone number,
				// it's just the `value` parsed by `input-format`.
				value: value,
				// `this.state.value_property` is the `this.props.value`
				// which corresponding to `this.state.value`.
				// It is being compared in `componentWillReceiveProps()`
				// against `newProps.value` to find out if the new `value` property
				// needs `this.state.value` recalculation.
				value_property: value
			},
			// Write the new `this.props.value`.
			function () {
				return onChange(value);
			});
		}

		// For international phone numbers
		if (value[0] === '+') {
			// If an international phone number is being erased up to the first `+` sign
			// or if an international phone number is just starting (with a `+` sign)
			// then unset the current country because it's clear that a user intends to change it.
			if (value.length === 1) {
				// If "International" country option has not been disabled
				// then reset the currently selected country.
				if (!changed_country && should_add_international_option(_this2.props)) {
					country_code = undefined;
					_this2.set_country_code_value(country_code);
				}
			} else {
				// If a phone number is being input as an international one
				// and the country code can already be derived,
				// then switch the country.
				// (`001` is a special "non-geograpical entity" code in `libphonenumber` library)
				if (!changed_country && _this2.formatter.country && _this2.formatter.country !== '001' && _this2.is_selectable_country(_this2.formatter.country)) {
					country_code = _this2.formatter.country;
					_this2.set_country_code_value(country_code);
				}
				// If "International" country option has not been disabled
				// and the international phone number entered doesn't correspond
				// to the currently selected country then reset the currently selected country.
				else if (!changed_country && should_add_international_option(_this2.props) && country_code && value.indexOf((0, _libphonenumberJs.getPhoneCode)(country_code) !== '+'.length)) {
						country_code = undefined;
						_this2.set_country_code_value(country_code);
					}
			}
		}
		// If "International" mode is selected
		// and the `value` doesn't start with a + sign,
		// then prepend it to the `value`.
		else if (!country_code) {
				value = '+' + value;
			}

		// `this.state.value_property` is the `this.props.value`
		// which corresponding to `this.state.value`.
		// It is being compared in `componentWillReceiveProps()`
		// against `newProps.value` to find out if the new `value` property
		// needs `this.state.value` recalculation.
		var value_property = void 0;

		// `value` equal to `+` makes no sense
		if (value === '+') {
			value_property = undefined;
		}
		// If a phone number is in international format then check
		// that the phone number entered belongs to the selected country.
		else if (country_code && value[0] === '+' && !(value.indexOf('+' + (0, _libphonenumberJs.getPhoneCode)(country_code)) === 0 && value.length > ('+' + (0, _libphonenumberJs.getPhoneCode)(country_code)).length)) {
				value_property = undefined;
			}
			// Should be a most-probably-valid phone number
			else {
					// Convert `value` to E.164 phone number format
					value_property = e164(value, country_code, metadata);
				}

		_this2.setState({
			// State `value` is the parsed input value
			// (e.g. `+78005553535`, `1234567`).
			// This is not `this.props.value`
			// i.e. it's not neccessarily an international plaintext phone number,
			// it's just the `value` parsed by `input-format`.
			value: value,
			// `this.state.value_property` is the `this.props.value`
			// which corresponding to `this.state.value`.
			// It is being compared in `componentWillReceiveProps()`
			// against `newProps.value` to find out if the new `value` property
			// needs `this.state.value` recalculation.
			value_property: value_property
		},
		// Write the new `this.props.value`.
		function () {
			return onChange(value_property);
		});
	};

	this.on_blur = function (event) {
		var onBlur = _this2.props.onBlur;
		var value_property = _this2.state.value_property;


		if (!onBlur) {
			return;
		}

		var _event = (0, _extends3.default)({}, event, {
			target: (0, _extends3.default)({}, event.target, {
				value: value_property
			})
		});

		// For `redux-form` event detection.
		// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
		_event.stopPropagation = event.stopPropagation;
		_event.preventDefault = event.preventDefault;

		return onBlur(_event);
	};

	this.country_select_toggled = function (is_shown) {
		_this2.setState({ country_select_is_shown: is_shown });
	};

	this.on_country_select_tab_out = function (event) {
		event.preventDefault();

		// Focus the phone number input upon country selection
		// (do it in a timeout because the `<input/>`
		//  is hidden while selecting a country)
		setTimeout(_this2.focus, 0);
	};

	this.store_select_instance = function (instance) {
		_this2.select = instance;
	};

	this.store_input_instance = function (instance) {
		_this2.input = instance;
	};
};

exports.default = Input;
function parse_partial_number(value, country_code, metadata) {
	// "As you type" formatter
	var formatter = new _libphonenumberJs.as_you_type(country_code, metadata);

	// Input partially entered phone number
	formatter.input(value);

	// Return the parsed partial phone number
	// (has `.national_number`, `.country`, etc)
	return formatter;
}

// Converts `value` to E.164 phone number format
function e164(value, country_code, metadata) {
	if (!value) {
		return undefined;
	}

	// If the phone number is being input in an international format
	if (value[0] === '+') {
		// If it's just the `+` sign
		if (value.length === 1) {
			return undefined;
		}

		// If there are some digits, the `value` is returned as is
		return value;
	}

	// For non-international phone number a country code is required
	if (!country_code) {
		return undefined;
	}

	// The phone number is being input in a country-specific format

	var partial_national_number = parse_partial_number(value, country_code).national_number;

	if (!partial_national_number) {
		return undefined;
	}

	// The value is converted to international plaintext
	return (0, _libphonenumberJs.format)(partial_national_number, country_code, 'International_plaintext', metadata);
}

// Gets country flag element by country code
function get_country_option_icon(countryCode, _ref2) {
	var flags = _ref2.flags;
	var flagsPath = _ref2.flagsPath;
	var flagComponent = _ref2.flagComponent;

	if (flags === false) {
		return undefined;
	}

	if (flags && flags[countryCode]) {
		return flags[countryCode];
	}

	return _react2.default.createElement(flagComponent, { countryCode: countryCode, flagsPath: flagsPath });
}

// Whether to add the "International" option to the list of countries
function should_add_international_option(properties) {
	var countries = properties.countries;
	var international = properties.international;

	// If this behaviour is explicitly set, then do as it says.

	if (international !== undefined) {
		return international;
	}

	// If `countries` is empty,
	// then only "International" option is available, so add it.
	if (countries.length === 0) {
		return true;
	}

	// If `countries` is a single allowed country,
	// then don't add the "International" option
	// because it would make no sense.
	if (countries.length === 1) {
		return false;
	}

	// Show the "International" option by default
	return true;
}

// Is it possible that the partially entered  phone number belongs to the given country
function could_phone_number_belong_to_country(phone_number, country_code, metadata) {
	// Strip the leading `+`
	var phone_number_digits = phone_number.slice('+'.length);

	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = (0, _getIterator3.default)((0, _keys2.default)(metadata.country_phone_code_to_countries)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var country_phone_code = _step4.value;

			var possible_country_phone_code = phone_number_digits.substring(0, country_phone_code.length);
			if (country_phone_code.indexOf(possible_country_phone_code) === 0) {
				// This country phone code is possible.
				// Does the given country correspond to this country phone code.
				if (metadata.country_phone_code_to_countries[country_phone_code].indexOf(country_code) >= 0) {
					return true;
				}
			}
		}
	} catch (err) {
		_didIteratorError4 = true;
		_iteratorError4 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion4 && _iterator4.return) {
				_iterator4.return();
			}
		} finally {
			if (_didIteratorError4) {
				throw _iteratorError4;
			}
		}
	}
}

// If a formatted phone number is an international one
// then it strips the `+${country_phone_code}` prefix from the formatted number.
function strip_country_phone_code(formatted_number, metadata) {
	if (!formatted_number || formatted_number[0] !== '+' || formatted_number === '+') {
		return formatted_number;
	}

	var _iteratorNormalCompletion5 = true;
	var _didIteratorError5 = false;
	var _iteratorError5 = undefined;

	try {
		for (var _iterator5 = (0, _getIterator3.default)((0, _keys2.default)(metadata.country_phone_code_to_countries)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
			var country_phone_code = _step5.value;

			if (formatted_number.indexOf(country_phone_code) === '+'.length) {
				return formatted_number.slice('+'.length + country_phone_code.length).trim();
			}
		}
	} catch (err) {
		_didIteratorError5 = true;
		_iteratorError5 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion5 && _iterator5.return) {
				_iterator5.return();
			}
		} finally {
			if (_didIteratorError5) {
				throw _iteratorError5;
			}
		}
	}

	return formatted_number;
}

// Validates country code
function normalize_country_code(country) {
	// Normalize `country` if it's an empty string
	if (country === '') {
		country = undefined;
	}

	// No country is selected ("International")
	if (country === undefined || country === null) {
		return country;
	}

	// Check that `country` code exists
	if (default_dictionary[country]) {
		return country;
	}

	throw new Error('Unknown country: "' + country + '"');
}
//# sourceMappingURL=input.js.map