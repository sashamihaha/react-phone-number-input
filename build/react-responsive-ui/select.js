'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _scrollIntoViewIfNeeded = require('scroll-into-view-if-needed');

var _scrollIntoViewIfNeeded2 = _interopRequireDefault(_scrollIntoViewIfNeeded);

var _dom = require('./misc/dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Possible enhancements:
//
//  * If the menu is close to a screen edge,
//    automatically reposition it so that it fits on the screen
//  * Maybe show menu immediately above the toggler
//    (like in Material design), not below it.
//
// https://material.google.com/components/menus.html

var Empty_value_option_value = '';

var value_prop_type = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool]);

var Select = function (_PureComponent) {
	(0, _inherits3.default)(Select, _PureComponent);

	function Select(props) {
		(0, _classCallCheck3.default)(this, Select);

		// Shouldn't memory leak because
		// the set of options is assumed to be constant.
		var _this = (0, _possibleConstructorReturn3.default)(this, (Select.__proto__ || (0, _getPrototypeOf2.default)(Select)).call(this, props));

		_initialiseProps.call(_this);

		_this.options = {};

		var _this$props = _this.props;
		var value = _this$props.value;
		var autocomplete = _this$props.autocomplete;
		var options = _this$props.options;
		var children = _this$props.children;
		var menu = _this$props.menu;
		var toggler = _this$props.toggler;
		var onChange = _this$props.onChange;


		if (autocomplete) {
			if (!options) {
				throw new Error('"options" property is required for an "autocomplete" select');
			}

			_this.state.matching_options = _this.get_matching_options(options, value);
		}

		if (children && !menu) {
			_react2.default.Children.forEach(children, function (element) {
				if (!element.props.value) {
					throw new Error('You must specify "value" prop on each child of <Select/>');
				}

				if (!element.props.label) {
					throw new Error('You must specify "label" prop on each child of <Select/>');
				}
			});
		}

		if (menu && !toggler) {
			throw new Error('Supply a "toggler" component when enabling "menu" in <Select/>');
		}

		if (!menu && !onChange) {
			throw new Error('"onChange" property must be specified for a non-menu <Select/>');
		}
		return _this;
	}

	// Client side rendering, javascript is enabled


	(0, _createClass3.default)(Select, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _props = this.props;
			var fallback = _props.fallback;
			var nativeExpanded = _props.nativeExpanded;


			document.addEventListener('click', this.document_clicked);

			if (fallback) {
				this.setState({ javascript: true });
			}

			if (nativeExpanded) {
				this.resize_native_expanded_select();
				window.addEventListener('resize', this.resize_native_expanded_select);
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(previous_props, previous_state) {
			var _props2 = this.props;
			var nativeExpanded = _props2.nativeExpanded;
			var value = _props2.value;
			var _state = this.state;
			var expanded = _state.expanded;
			var height = _state.height;


			if (expanded !== previous_state.expanded) {
				if (expanded && this.should_animate()) {
					if (height === undefined) {
						this.calculate_height();
					}
				}
			}

			// If the `value` changed then resize the native expanded `<select/>`
			if (nativeExpanded && value !== previous_props.value) {
				this.resize_native_expanded_select();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			var nativeExpanded = this.props.nativeExpanded;


			document.removeEventListener('click', this.document_clicked);

			if (nativeExpanded) {
				window.removeEventListener('resize', this.resize_native_expanded_select);
			}

			if (this.toggle_timeout) {
				clearTimeout(this.toggle_timeout);
				this.toggle_timeout = undefined;
			}

			if (this.scroll_into_view_timeout) {
				clearTimeout(this.scroll_into_view_timeout);
				this.scroll_into_view_timeout = undefined;
			}

			if (this.restore_focus_on_collapse_timeout) {
				clearTimeout(this.restore_focus_on_collapse_timeout);
				this.restore_focus_on_collapse_timeout = undefined;
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props3 = this.props;
			var id = _props3.id;
			var upward = _props3.upward;
			var scroll = _props3.scroll;
			var children = _props3.children;
			var menu = _props3.menu;
			var toggler = _props3.toggler;
			var alignment = _props3.alignment;
			var autocomplete = _props3.autocomplete;
			var saveOnIcons = _props3.saveOnIcons;
			var fallback = _props3.fallback;
			var native = _props3.native;
			var nativeExpanded = _props3.nativeExpanded;
			var disabled = _props3.disabled;
			var required = _props3.required;
			var placeholder = _props3.placeholder;
			var label = _props3.label;
			var value = _props3.value;
			var error = _props3.error;
			var style = _props3.style;
			var className = _props3.className;
			var _state2 = this.state;
			var expanded = _state2.expanded;
			var list_height = _state2.list_height;


			var options = this.get_options();

			var list_style = void 0;

			// Makes the options list scrollable (only when not in `autocomplete` mode).
			if (this.is_scrollable() && this.state.list_height !== undefined) {
				list_style = { maxHeight: list_height + 'px' };
			}

			var overflow = scroll && options && this.overflown();

			var list_items = void 0;

			// If a list of options is supplied as an array of `{ value, label }`,
			// then transform those elements to <buttons/>
			if (options) {
				list_items = options.map(function (_ref, index) {
					var value = _ref.value;
					var label = _ref.label;
					var icon = _ref.icon;

					return _this2.render_list_item({ index: index, value: value, label: label, icon: !saveOnIcons && icon, overflow: overflow });
				});
			}
			// Else, if a list of options is supplied as a set of child React elements,
			// then render those elements.
			else {
					list_items = _react2.default.Children.map(children, function (element, index) {
						if (!element) {
							return;
						}

						return _this2.render_list_item({ index: index, element: element });
					});
				}

			var wrapper_style = { textAlign: alignment };

			var selected = this.get_selected_option();

			var markup = _react2.default.createElement(
				'div',
				{
					ref: function ref(_ref3) {
						return _this2.select = _ref3;
					},
					onKeyDown: this.on_key_down_in_container,
					onBlur: this.on_blur,
					style: style ? (0, _extends3.default)({}, wrapper_style, style) : wrapper_style,
					className: (0, _classnames2.default)('rrui__select', {
						'rrui__rich': fallback,
						'rrui__select--upward': upward,
						'rrui__select--expanded': expanded,
						'rrui__select--collapsed': !expanded,
						'rrui__select--disabled': disabled
					}, className) },
				_react2.default.createElement(
					'div',
					{
						className: (0, _classnames2.default)({
							'rrui__input': !toggler
						}) },
					!menu && !native && this.render_selected_item(),
					label && (this.get_selected_option() || placeholder) && _react2.default.createElement(
						'label',
						{
							htmlFor: id,
							className: (0, _classnames2.default)('rrui__input-label', {
								'rrui__input-label--required': required && value_is_empty(value),
								'rrui__input-label--invalid': this.should_indicate_invalid()
							}) },
						label
					),
					menu && this.render_toggler(),
					!native && !nativeExpanded && list_items.length > 0 && _react2.default.createElement(
						'ul',
						{
							ref: function ref(_ref2) {
								return _this2.list = _ref2;
							},
							style: list_style,
							className: (0, _classnames2.default)('rrui__expandable', 'rrui__expandable--overlay', 'rrui__select__options', 'rrui__shadow', {
								'rrui__select__options--menu': menu,
								'rrui__expandable--expanded': expanded,
								'rrui__select__options--expanded': expanded,
								'rrui__expandable--left-aligned': alignment === 'left',
								'rrui__expandable--right-aligned': alignment === 'right',
								'rrui__select__options--left-aligned': !children && alignment === 'left',
								'rrui__select__options--right-aligned': !children && alignment === 'right',
								// CSS selector performance optimization
								'rrui__select__options--upward': upward,
								'rrui__select__options--downward': !upward
							}) },
						list_items
					),
					(native || fallback && !this.state.javascript) && this.render_static()
				),
				this.should_indicate_invalid() && _react2.default.createElement(
					'div',
					{ className: 'rrui__input-error' },
					error
				)
			);

			return markup;
		}
	}, {
		key: 'render_list_item',
		value: function render_list_item(_ref4) // , first, last
		{
			var _this3 = this;

			var index = _ref4.index;
			var element = _ref4.element;
			var value = _ref4.value;
			var label = _ref4.label;
			var icon = _ref4.icon;
			var overflow = _ref4.overflow;
			var _props4 = this.props;
			var disabled = _props4.disabled;
			var menu = _props4.menu;
			var scrollbarPadding = _props4.scrollbarPadding;
			var _state3 = this.state;
			var focused_option_value = _state3.focused_option_value;
			var expanded = _state3.expanded;

			// If a list of options is supplied as a set of child React elements,
			// then extract values from their props.

			if (element) {
				value = element.props.value;
			}

			var is_focused = !menu && value === focused_option_value;

			var item_style = void 0;

			// on overflow the vertical scrollbar will take up space
			// reducing padding-right and the only way to fix that
			// is to add additional padding-right
			//
			// a hack to restore padding-right taken up by a vertical scrollbar
			if (overflow && scrollbarPadding) {
				item_style = { marginRight: (0, _dom.get_scrollbar_width)() + 'px' };
			}

			var button = void 0;

			// If a list of options is supplied as a set of child React elements,
			// then enhance those elements with extra props.
			if (element) {
				(function () {
					var extra_props = {
						style: item_style ? (0, _extends3.default)({}, item_style, element.props.style) : element.props.style,
						className: (0, _classnames2.default)('rrui__select__option', {
							'rrui__select__option--focused': is_focused
						}, element.props.className)
					};

					var onClick = element.props.onClick;

					extra_props.onClick = function (event) {
						if (menu) {
							_this3.toggle();
						} else {
							_this3.item_clicked(value, event);
						}

						if (onClick) {
							onClick(event);
						}
					};

					button = _react2.default.cloneElement(element, extra_props);
				})();
			}
			// Else, if a list of options is supplied as an array of `{ value, label }`,
			// then transform those options to <buttons/>
			else {
					button = _react2.default.createElement(
						'button',
						{
							type: 'button',
							onClick: function onClick(event) {
								return _this3.item_clicked(value, event);
							},
							disabled: disabled,
							tabIndex: '-1',
							className: (0, _classnames2.default)('rrui__select__option', {
								'rrui__select__option--focused': is_focused,
								// CSS selector performance optimization
								'rrui__select__option--disabled': disabled
							}),
							style: item_style },
						icon && _react2.default.cloneElement(icon, { className: (0, _classnames2.default)(icon.props.className, 'rrui__select__option-icon') }),
						label
					);
				}

			var markup = _react2.default.createElement(
				'li',
				{
					key: get_option_key(value),
					ref: function ref(_ref5) {
						return _this3.options[get_option_key(value)] = _ref5;
					},
					className: (0, _classnames2.default)('rrui__expandable__content', 'rrui__select__options-list-item', {
						'rrui__select__separator-option': element && element.type === Select.Separator,
						'rrui__expandable__content--expanded': expanded,
						// CSS selector performance optimization
						'rrui__select__options-list-item--expanded': expanded
					}) },
				button
			);

			return markup;
		}

		// Renders the selected option
		// and possibly a transparent native `<select/>` above it
		// so that the native `<select/>` expands upon click
		// on the selected option
		// (in case of `nativeExpanded` setting).

	}, {
		key: 'render_selected_item',
		value: function render_selected_item() {
			var _props5 = this.props;
			var nativeExpanded = _props5.nativeExpanded;
			var toggler = _props5.toggler;


			if (toggler) {
				return this.render_toggler();
			}

			var selected = this.render_selected_item_only();

			if (nativeExpanded) {
				return _react2.default.createElement(
					'div',
					{ style: native_expanded_select_container_style },
					this.render_static(),
					selected
				);
			}

			return selected;
		}
	}, {
		key: 'render_selected_item_only',
		value: function render_selected_item_only() {
			var _this4 = this;

			var _props6 = this.props;
			var children = _props6.children;
			var value = _props6.value;
			var placeholder = _props6.placeholder;
			var label = _props6.label;
			var disabled = _props6.disabled;
			var autocomplete = _props6.autocomplete;
			var concise = _props6.concise;
			var nativeExpanded = _props6.nativeExpanded;
			var tabIndex = _props6.tabIndex;
			var onFocus = _props6.onFocus;
			var title = _props6.title;
			var inputClassName = _props6.inputClassName;
			var _state4 = this.state;
			var expanded = _state4.expanded;
			var autocomplete_width = _state4.autocomplete_width;
			var autocomplete_input_value = _state4.autocomplete_input_value;


			var selected = this.get_selected_option();
			var selected_label = this.get_selected_option_label();

			var selected_text = selected ? selected_label : placeholder || label;

			var selected_style_classes = {
				'rrui__input-field': true,
				'rrui__select__selected': true,
				'rrui__select__selected--nothing': !selected_label,
				// CSS selector performance optimization
				'rrui__select__selected--expanded': expanded,
				'rrui__select__selected--disabled': disabled
			};

			if (autocomplete && expanded) {
				// style = { ...style, width: autocomplete_width + 'px' }

				return _react2.default.createElement('input', {
					type: 'text',
					ref: function ref(_ref6) {
						return _this4.autocomplete = _ref6;
					},
					placeholder: selected_text,
					value: autocomplete_input_value,
					onChange: this.on_autocomplete_input_change,
					onKeyDown: this.on_key_down,
					onFocus: onFocus,
					tabIndex: tabIndex,
					title: title,
					className: (0, _classnames2.default)(selected_style_classes, 'rrui__select__selected--autocomplete', inputClassName) });
			}

			return _react2.default.createElement(
				'button',
				{
					ref: function ref(_ref7) {
						return _this4.selected = _ref7;
					},
					type: 'button',
					disabled: disabled,
					onClick: this.toggle,
					onKeyDown: this.on_key_down,
					onFocus: onFocus,
					tabIndex: nativeExpanded ? -1 : tabIndex,
					title: title,
					className: (0, _classnames2.default)(selected_style_classes, {
						'rrui__input-field--invalid': this.should_indicate_invalid()
					}) },
				_react2.default.createElement(
					'div',
					{ className: 'rrui__select__selected-content' },
					_react2.default.createElement(
						'div',
						{ className: 'rrui__select__selected-label' },
						concise && selected && selected.icon ? _react2.default.cloneElement(selected.icon, { title: selected_label }) : selected_text
					),
					_react2.default.createElement('div', {
						className: (0, _classnames2.default)('rrui__select__arrow', {
							// CSS selector performance optimization
							'rrui__select__arrow--expanded': expanded,
							'rrui__select__arrow--disabled': disabled
						}) })
				)
			);
		}
	}, {
		key: 'render_toggler',
		value: function render_toggler() {
			var _this5 = this;

			var toggler = this.props.toggler;


			return _react2.default.createElement(
				'div',
				{ className: 'rrui__select__toggler' },
				_react2.default.cloneElement(toggler, {
					ref: function ref(_ref8) {
						return _this5.selected = _ref8;
					},
					onClick: this.toggle,
					onKeyDown: this.on_key_down
				})
			);
		}

		// supports disabled javascript

	}, {
		key: 'render_static',
		value: function render_static() {
			var _this6 = this;

			var _props7 = this.props;
			var id = _props7.id;
			var name = _props7.name;
			var value = _props7.value;
			var label = _props7.label;
			var disabled = _props7.disabled;
			var options = _props7.options;
			var menu = _props7.menu;
			var toggler = _props7.toggler;
			var fallback = _props7.fallback;
			var native = _props7.native;
			var nativeExpanded = _props7.nativeExpanded;
			var tabIndex = _props7.tabIndex;
			var children = _props7.children;


			if (menu) {
				var _markup = _react2.default.createElement(
					'div',
					{
						className: (0, _classnames2.default)({
							'rrui__rich__fallback': fallback
						}) },
					toggler
				);

				return _markup;
			}

			var markup = _react2.default.createElement(
				'select',
				{
					ref: function ref(_ref9) {
						return _this6.native = _ref9;
					},
					id: id,
					name: name,
					value: value_is_empty(value) ? Empty_value_option_value : value,
					disabled: disabled,
					onChange: this.native_select_on_change,
					tabIndex: native || nativeExpanded ? tabIndex : undefined,
					className: (0, _classnames2.default)('rrui__input', 'rrui__select__native', {
						'rrui__select__native-expanded': nativeExpanded,
						'rrui__rich__fallback': fallback
					}) },
				options ? this.render_native_select_options(options, value_is_empty(value)) : _react2.default.Children.map(children, function (child) {
					if (!child) {
						return;
					}

					var markup = _react2.default.createElement(
						'option',
						{
							className: 'rrui__select__native-option',
							key: child.props.value,
							value: child.props.value },
						child.props.label
					);

					return markup;
				})
			);

			return markup;
		}
	}, {
		key: 'render_native_select_options',
		value: function render_native_select_options(options, empty_option_is_selected) {
			var placeholder = this.props.placeholder;


			var empty_option_present = false;

			var rendered_options = options.map(function (option) {
				var value = option.value;
				var label = option.label;


				if (value_is_empty(value)) {
					empty_option_present = true;
					value = Empty_value_option_value;
				}

				var markup = _react2.default.createElement(
					'option',
					{
						className: 'rrui__select__native-option',
						key: get_option_key(value),
						value: value },
					label
				);

				return markup;
			});

			if (empty_option_is_selected && !empty_option_present) {
				rendered_options.unshift(_react2.default.createElement(
					'option',
					{
						className: 'rrui__select__native-option',
						key: get_option_key(undefined),
						value: '' },
					placeholder
				));
			}

			return rendered_options;
		}

		// Whether should indicate that the input value is invalid

	}, {
		key: 'should_indicate_invalid',
		value: function should_indicate_invalid() {
			var _props8 = this.props;
			var indicateInvalid = _props8.indicateInvalid;
			var error = _props8.error;


			return indicateInvalid && error;
		}
	}, {
		key: 'get_selected_option',
		value: function get_selected_option() {
			var value = this.props.value;


			return this.get_option(value);
		}
	}, {
		key: 'get_option',
		value: function get_option(value) {
			var _props9 = this.props;
			var options = _props9.options;
			var children = _props9.children;


			if (options) {
				return options.filter(function (x) {
					return x.value === value;
				})[0];
			}

			var option = void 0;

			_react2.default.Children.forEach(children, function (child) {
				if (child.props.value === value) {
					option = child;
				}
			});

			return option;
		}
	}, {
		key: 'get_option_index',
		value: function get_option_index(option) {
			var _props10 = this.props;
			var options = _props10.options;
			var children = _props10.children;


			if (options) {
				return options.indexOf(option);
			}

			var option_index = void 0;

			_react2.default.Children.forEach(children, function (child, index) {
				if (child.props.value === option.value) {
					option_index = index;
				}
			});

			return option_index;
		}
	}, {
		key: 'get_selected_option_label',
		value: function get_selected_option_label() {
			var options = this.props.options;


			var selected = this.get_selected_option();

			if (!selected) {
				return;
			}

			if (options) {
				return selected.label;
			}

			return selected.props.label;
		}
	}, {
		key: 'overflown',
		value: function overflown() {
			var _props11 = this.props;
			var options = _props11.options;
			var maxItems = _props11.maxItems;


			return options.length > maxItems;
		}
	}, {
		key: 'scrollable_list_height',
		value: function scrollable_list_height() {
			var state = arguments.length <= 0 || arguments[0] === undefined ? this.state : arguments[0];
			var maxItems = this.props.maxItems;

			// (Adding vertical padding so that it shows these `maxItems` options fully)

			return (state.height - 2 * state.vertical_padding) * (maxItems / this.get_options().length) + state.vertical_padding;
		}
	}, {
		key: 'should_animate',
		value: function should_animate() {
			return true;

			// return this.props.options.length >= this.props.transition_item_count_min
		}
	}, {
		key: 'focus',
		value: function focus() {
			if (this.autocomplete) {
				this.autocomplete.focus();
			} else {
				this.selected.focus();
			}
		}

		// Would have used `onBlur={...}` event handler here
		// with `if (container.contains(event.relatedTarget))` condition,
		// but it doesn't work in IE in React.
		// https://github.com/facebook/react/issues/3751
		//
		// Therefore, using the hacky `document.onClick` handlers
		// and this `onKeyDown` Tab handler
		// until `event.relatedTarget` support is consistent in React.
		//


		// This handler is a workaround for `redux-form`

	}, {
		key: 'get_options',
		value: function get_options() {
			var _props12 = this.props;
			var autocomplete = _props12.autocomplete;
			var autocompleteShowAll = _props12.autocompleteShowAll;
			var maxItems = _props12.maxItems;
			var options = _props12.options;
			var matching_options = this.state.matching_options;


			if (!autocomplete) {
				return options;
			}

			if (autocompleteShowAll) {
				return matching_options;
			}

			return matching_options.slice(0, maxItems);
		}

		// Get the previous option (relative to the currently focused option)

	}, {
		key: 'previous_focusable_option',
		value: function previous_focusable_option() {
			var options = this.get_options();
			var focused_option_value = this.state.focused_option_value;


			var i = 0;
			while (i < options.length) {
				if (options[i].value === focused_option_value) {
					if (i - 1 >= 0) {
						return options[i - 1];
					}
				}
				i++;
			}
		}

		// Get the next option (relative to the currently focused option)

	}, {
		key: 'next_focusable_option',
		value: function next_focusable_option() {
			var options = this.get_options();
			var focused_option_value = this.state.focused_option_value;


			var i = 0;
			while (i < options.length) {
				if (options[i].value === focused_option_value) {
					if (i + 1 < options.length) {
						return options[i + 1];
					}
				}
				i++;
			}
		}

		// Scrolls to an option having the value

	}, {
		key: 'scroll_to',
		value: function scroll_to(value) {
			var vertical_padding = this.state.vertical_padding;


			var option_element = _reactDom2.default.findDOMNode(this.options[get_option_key(value)]);
			var list = _reactDom2.default.findDOMNode(this.list);

			// If this option isn't even shown
			// (e.g. autocomplete)
			// then don't scroll to it because there's nothing to scroll to.
			if (!option_element) {
				return;
			}

			var offset_top = option_element.offsetTop;

			var is_first_option = list.firstChild === option_element;

			// If it's the first one - then scroll to list top
			if (is_first_option) {
				offset_top -= vertical_padding;
			}

			list.scrollTop = offset_top;
		}

		// Fully shows an option having the `value` (scrolls to it if neccessary)

	}, {
		key: 'show_option',
		value: function show_option(value, gravity) {
			var vertical_padding = this.state.vertical_padding;


			var option_element = _reactDom2.default.findDOMNode(this.options[get_option_key(value)]);
			var list = _reactDom2.default.findDOMNode(this.list);

			var is_first_option = list.firstChild === option_element;
			var is_last_option = list.lastChild === option_element;

			switch (gravity) {
				case 'top':
					var top_line = option_element.offsetTop;

					if (is_first_option) {
						top_line -= vertical_padding;
					}

					if (top_line < list.scrollTop) {
						list.scrollTop = top_line;
					}

					return;

				case 'bottom':
					var bottom_line = option_element.offsetTop + option_element.offsetHeight;

					if (is_last_option) {
						bottom_line += vertical_padding;
					}

					if (bottom_line > list.scrollTop + list.offsetHeight) {
						list.scrollTop = bottom_line - list.offsetHeight;
					}

					return;
			}
		}

		// Calculates height of the expanded item list

	}, {
		key: 'calculate_height',
		value: function calculate_height() {
			var options = this.props.options;


			var list_dom_node = _reactDom2.default.findDOMNode(this.list);
			var border = parseInt(window.getComputedStyle(list_dom_node).borderTopWidth);
			var height = list_dom_node.scrollHeight;

			var vertical_padding = parseInt(window.getComputedStyle(list_dom_node).paddingTop);

			// For things like "accordeon".
			//
			// const images = list_dom_node.querySelectorAll('img')
			//
			// if (images.length > 0)
			// {
			// 	return this.preload_images(list_dom_node, images)
			// }

			var state = { height: height, vertical_padding: vertical_padding, border: border };

			if (this.is_scrollable() && options && this.overflown()) {
				state.list_height = this.scrollable_list_height(state);
			}

			this.setState(state);
		}
	}, {
		key: 'is_scrollable',
		value: function is_scrollable() {
			var _props13 = this.props;
			var menu = _props13.menu;
			var autocomplete = _props13.autocomplete;
			var autocompleteShowAll = _props13.autocompleteShowAll;
			var scroll = _props13.scroll;


			return !menu && (autocomplete && autocompleteShowAll || !autocomplete) && scroll;
		}

		// This turned out not to work for `autocomplete`
		// because not all options are ever shown.
		// get_widest_label_width()
		// {
		// 	// <ul/> -> <li/> -> <button/>
		// 	const label = ReactDOM.findDOMNode(this.list).firstChild.firstChild
		//
		// 	const style = getComputedStyle(label)
		//
		// 	const width = parseFloat(style.width)
		// 	const side_padding = parseFloat(style.paddingLeft)
		//
		// 	return width - 2 * side_padding
		// }

	}, {
		key: 'get_matching_options',


		// // https://github.com/daviferreira/react-sanfona/blob/master/src/AccordionItem/index.jsx#L54
		// // Wait for images to load before calculating maxHeight
		// preload_images(node, images)
		// {
		// 	let images_loaded = 0
		//
		// 	const image_loaded = () =>
		// 	{
		// 		images_loaded++
		//
		// 		if (images_loaded === images.length)
		// 		{
		// 			this.setState
		// 			({
		// 				height: this.props.expanded ? node.scrollHeight : 0
		// 			})
		// 		}
		// 	}
		//
		// 	for (let i = 0; i < images.length; i += 1)
		// 	{
		// 		const image = new Image()
		// 		image.src = images[i].src
		// 		image.onload = image.onerror = image_loaded
		// 	}
		// }
		value: function get_matching_options(options, value) {
			// If the autocomplete value is `undefined` or empty
			if (!value) {
				return options;
			}

			value = value.toLowerCase();

			return options.filter(function (_ref10) {
				var label = _ref10.label;
				var verbose = _ref10.verbose;

				return (verbose || label).toLowerCase().indexOf(value) >= 0;
			});
		}
	}]);
	return Select;
}(_react.PureComponent);

Select.propTypes = {
	// A list of selectable options
	options: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		// Option value (may be `undefined`)
		value: value_prop_type,
		// Option label (may be `undefined`)
		label: _propTypes2.default.string,
		// Option icon
		icon: _propTypes2.default.node
	})),

	// HTML form input `name` attribute
	name: _propTypes2.default.string,

	// Label which is placed above the select
	label: _propTypes2.default.string,

	// Placeholder (like "Choose")
	placeholder: _propTypes2.default.string,

	// Whether to use native `<select/>`
	native: _propTypes2.default.bool.isRequired,

	// Whether to use native `<select/>` when expanded
	nativeExpanded: _propTypes2.default.bool.isRequired,

	// Show icon only for selected item,
	// and only if `concise` is `true`.
	saveOnIcons: _propTypes2.default.bool,

	// Disables this control
	disabled: _propTypes2.default.bool,

	// Set to `true` to mark the field as required
	required: _propTypes2.default.bool.isRequired,

	// Selected option value
	value: value_prop_type,

	// Is called when an option is selected
	onChange: _propTypes2.default.func,

	// Is called when the select is focused
	onFocus: _propTypes2.default.func,

	// Is called when the select is blurred.
	// This `onBlur` interceptor is a workaround for `redux-form`,
	// so that it gets the parsed `value` in its `onBlur` handler,
	// not the formatted text.
	onBlur: _propTypes2.default.func,

	// (exotic use case)
	// Falls back to a plain HTML input
	// when javascript is disabled (e.g. Tor)
	fallback: _propTypes2.default.bool.isRequired,

	// Component CSS class
	className: _propTypes2.default.string,

	// Autocomplete `<input/>` CSS class
	inputClassName: _propTypes2.default.string,

	// CSS style object
	style: _propTypes2.default.object,

	// If this flag is set to `true`,
	// and `icon` is specified for a selected option,
	// then the selected option will be displayed
	// as icon only, without the label.
	concise: _propTypes2.default.bool,

	// HTML `tabindex` attribute
	tabIndex: _propTypes2.default.number,

	// If set to `true`, autocompletion is available
	// upon expanding the options list.
	autocomplete: _propTypes2.default.bool,

	// If set to `true`, autocomple will show all
	// matching options instead of just `maxItems`.
	autocompleteShowAll: _propTypes2.default.bool,

	// Options list alignment ("left", "right")
	alignment: _propTypes2.default.oneOf(['left', 'right']),

	// If `menu` flag is set to `true`
	// then it's gonna be a dropdown menu
	// with `children` elements inside
	// and therefore `onChange` won't be called
	// on menu item click.
	menu: _propTypes2.default.bool,

	// If `menu` flag is set to `true`
	// then `toggler` is the dropdown menu button.
	toggler: _propTypes2.default.element,

	// If `scroll` is `false`, then options list
	// is not limited in height.
	// Is `true` by default (scrollable).
	scroll: _propTypes2.default.bool.isRequired,

	// If this flag is set to `true`,
	// then the dropdown expands itself upward.
	// (as opposed to the default downward)
	upward: _propTypes2.default.bool,

	// Maximum items fitting the options list height (scrollable).
	// In case of `autocomplete` that's the maximum number of matched items shown.
	// Is `6` by default.
	maxItems: _propTypes2.default.number.isRequired,

	// Is `true` by default (only when the list of options is scrollable)
	scrollbarPadding: _propTypes2.default.bool,

	focusUponSelection: _propTypes2.default.bool.isRequired,

	// When the `<Select/>` is expanded
	// the options list may not fit on the screen.
	// If `scrollIntoView` is `true` (which is the default)
	// then the browser will automatically scroll
	// so that the expanded options list fits on the screen.
	scrollIntoView: _propTypes2.default.bool.isRequired,

	// If `scrollIntoView` is `true` (which is the default)
	// then this is gonna be the delay after which it scrolls into view.
	expandAnimationDuration: _propTypes2.default.number.isRequired,

	onTabOut: _propTypes2.default.func,

	onToggle: _propTypes2.default.func

	// transition_item_count_min : PropTypes.number,
	// transition_duration_min : PropTypes.number,
	// transition_duration_max : PropTypes.number
};
Select.defaultProps = {
	alignment: 'left',
	scroll: true,
	maxItems: 6,
	scrollbarPadding: true,
	focusUponSelection: true,
	fallback: false,
	native: false,
	nativeExpanded: false,
	scrollIntoView: true,
	expandAnimationDuration: 150,

	// Set to `true` to mark the field as required
	required: false

};

var _initialiseProps = function _initialiseProps() {
	var _this7 = this;

	this.state = {
		// Is initialized during the first `componentDidUpdate()` call
		vertical_padding: 0
	};

	this.native_select_on_change = function (event) {
		var onChange = _this7.props.onChange;


		var value = event.target.value;

		// Convert back from an empty string to `undefined`
		if (value === Empty_value_option_value) {
			// `null` is not accounted for, use `undefined` instead.
			value = undefined;
		}

		onChange(value);
	};

	this.resize_native_expanded_select = function () {
		// For some strange reason 1px on the right side of the `<select/>`
		// still falls through to the underlying selected option label.
		_reactDom2.default.findDOMNode(_this7.native).style.width = _reactDom2.default.findDOMNode(_this7.selected).offsetWidth + 1 + 'px';
	};

	this.toggle = function (event) {
		var toggle_options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		if (event) {
			// Don't navigate away when clicking links
			event.preventDefault();

			// Not discarding the click event because
			// other expanded selects may be listening to it.
			// // Discard the click event so that it won't reach `document` click listener
			// event.stopPropagation() // doesn't work
			// event.nativeEvent.stopImmediatePropagation()
		}

		var _props14 = _this7.props;
		var toggler = _props14.toggler;
		var disabled = _props14.disabled;
		var autocomplete = _props14.autocomplete;
		var options = _props14.options;
		var value = _props14.value;
		var focusUponSelection = _props14.focusUponSelection;
		var onToggle = _props14.onToggle;
		var nativeExpanded = _props14.nativeExpanded;
		var scrollIntoView = _props14.scrollIntoView;
		var expandAnimationDuration = _props14.expandAnimationDuration;


		if (nativeExpanded) {
			return;
		}

		if (disabled) {
			return;
		}

		if (_this7.toggle_timeout) {
			clearTimeout(_this7.toggle_timeout);
			_this7.toggle_timeout = undefined;
		}

		if (_this7.scroll_into_view_timeout) {
			clearTimeout(_this7.scroll_into_view_timeout);
			_this7.scroll_into_view_timeout = undefined;
		}

		var expanded = _this7.state.expanded;


		if (!expanded && autocomplete) {
			_this7.setState({
				// The input value can't be `undefined`
				// because in that case React would complain
				// about it being an "uncontrolled input"
				autocomplete_input_value: '',
				matching_options: options
			});

			// if (!this.state.autocomplete_width)
			// {
			// 	this.setState({ autocomplete_width: this.get_widest_label_width() })
			// }
		}

		// Deferring expanding the select upon click
		// because `document.onClick(event)` should fire first,
		// otherwise `event.target` in that handler will be detached
		// from the document and so `this.document_clicked()` handler will
		// immediately toggle the select back to collapsed state.
		_this7.toggle_timeout = setTimeout(function () {
			_this7.toggle_timeout = undefined;

			_this7.setState({
				expanded: !expanded
			}, function () {
				var is_now_expanded = _this7.state.expanded;

				if (!toggle_options.dont_focus_after_toggle) {
					// If it's autocomplete, then focus <input/> field
					// upon toggling the select component.
					if (autocomplete) {
						if (is_now_expanded) {
							// Focus the input after the select is expanded
							_this7.autocomplete.focus();
						} else if (focusUponSelection) {
							// Focus the toggler after the select is collapsed
							_this7.selected.focus();
						}
					} else {
						// For some reason Firefox loses focus
						// upon select expansion via a click,
						// so this extra `.focus()` works around that issue.
						_this7.selected.focus();
					}
				}

				_this7.scroll_into_view_timeout = setTimeout(function () {
					_this7.scroll_into_view_timeout = undefined;

					var is_still_expanded = _this7.state.expanded;

					if (is_still_expanded && _this7.list && scrollIntoView) {
						var element = _reactDom2.default.findDOMNode(_this7.list);

						// https://developer.mozilla.org/ru/docs/Web/API/Element/scrollIntoViewIfNeeded
						if (element.scrollIntoViewIfNeeded) {
							element.scrollIntoViewIfNeeded(false);
						} else {
							// https://github.com/stipsan/scroll-into-view-if-needed
							(0, _scrollIntoViewIfNeeded2.default)(element, false, { duration: 800 });
						}
					}
				}, expandAnimationDuration * 1.1);
			});

			if (!expanded && options) {
				// Focus either the selected option
				// or the first option in the list.

				var focused_option_value = value || options[0].value;

				_this7.setState({ focused_option_value: focused_option_value });

				// Scroll down to the focused option
				_this7.scroll_to(focused_option_value);
			}

			if (onToggle) {
				onToggle(!expanded);
			}

			if (toggle_options.callback) {
				toggle_options.callback();
			}
		}, 0);
	};

	this.item_clicked = function (value, event) {
		if (event) {
			event.preventDefault();
		}

		var onChange = _this7.props.onChange;


		_this7.toggle(undefined, { callback: function callback() {
				return onChange(value);
			} });
	};

	this.document_clicked = function (event) {
		var autocomplete = _reactDom2.default.findDOMNode(_this7.autocomplete);
		var selected_option = _reactDom2.default.findDOMNode(_this7.selected);
		var options_list = _reactDom2.default.findDOMNode(_this7.list);

		// Don't close the select if its expander button has been clicked,
		// or if autocomplete has been clicked,
		// or if an option was selected from the list.
		if (options_list && options_list.contains(event.target) || autocomplete && autocomplete.contains(event.target) || selected_option && selected_option.contains(event.target)) {
			return;
		}

		_this7.setState({ expanded: false });

		var onToggle = _this7.props.onToggle;


		if (onToggle) {
			onToggle(false);
		}
	};

	this.on_key_down_in_container = function (event) {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return;
		}

		var expanded = _this7.state.expanded;


		switch (event.keyCode) {
			// Toggle on Tab out
			case 9:
				if (expanded) {
					_this7.toggle(undefined, { dont_focus_after_toggle: true });

					var onTabOut = _this7.props.onTabOut;


					if (onTabOut) {
						onTabOut(event);
					}
				}
				return;
		}
	};

	this.on_key_down = function (event) {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return;
		}

		var _props15 = _this7.props;
		var options = _props15.options;
		var value = _props15.value;
		var autocomplete = _props15.autocomplete;
		var _state5 = _this7.state;
		var expanded = _state5.expanded;
		var focused_option_value = _state5.focused_option_value;

		// Maybe add support for `children` arrow navigation in future

		if (options) {
			switch (event.keyCode) {
				// Select the previous option (if present) on up arrow
				case 38:
					event.preventDefault();

					var previous = _this7.previous_focusable_option();

					if (previous) {
						_this7.show_option(previous.value, 'top');
						return _this7.setState({ focused_option_value: previous.value });
					}

					return;

				// Select the next option (if present) on down arrow
				case 40:
					event.preventDefault();

					var next = _this7.next_focusable_option();

					if (next) {
						_this7.show_option(next.value, 'bottom');
						return _this7.setState({ focused_option_value: next.value });
					}

					return;

				// Collapse on Escape
				//
				// Maybe add this kind of support for "Escape" key in some future:
				//  hiding the item list, cancelling current item selection process
				//  and restoring the selection present before the item list was toggled.
				//
				case 27:
					// Collapse the list if it's expanded
					if (_this7.state.expanded) {
						_this7.toggle();

						// Restore focus when the list is collapsed
						_this7.restore_focus_on_collapse_timeout = setTimeout(function () {
							_this7.restore_focus_on_collapse_timeout = undefined;

							_this7.selected.focus();
						}, 0);
					}

					return;

				// on Enter
				case 13:
					// Choose the focused item on Enter
					if (expanded) {
						event.preventDefault();

						// If an item is focused
						// (which may not be a case
						//  when autocomplete is matching no items)
						// (still for non-autocomplete select
						//  it is valid to have a default option)
						if (_this7.get_options() && _this7.get_options().length > 0) {
							// Choose the focused item
							_this7.item_clicked(focused_option_value);
						}
					}
					// Else it should have just submitted the form on Enter,
					// but it wouldn't because the select element activator is a <button/>
					// therefore hitting Enter while being focused on it just pushes that button.
					// So submit the enclosing form manually.
					else {
							if ((0, _dom.submit_parent_form)(_reactDom2.default.findDOMNode(_this7.select))) {
								event.preventDefault();
							}
						}

					return;

				// on Spacebar
				case 32:
					// Choose the focused item on Enter
					if (expanded) {
						// only if it it's an `options` select
						// and also if it's not an autocomplete
						if (_this7.get_options() && !autocomplete) {
							event.preventDefault();

							// `focused_option_value` could be non-existent
							// in case of `autocomplete`, but since
							// we're explicitly not handling autocomplete here
							// it is valid to select any options including the default ones.
							_this7.item_clicked(focused_option_value);
						}
					}
					// Otherwise, the spacebar keydown event on a `<button/>`
					// will trigger `onClick` and `.toggle()` will be called.

					return;
			}
		}
	};

	this.on_blur = function (event) {
		var _props16 = _this7.props;
		var onBlur = _props16.onBlur;
		var value = _props16.value;

		// If clicked on a select option then don't trigger "blur" event

		if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) {
			return;
		}

		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the right (parsed, not the formatted one)
		// `event.target.value` in its `onBlur` handler.
		if (onBlur) {
			var _event = (0, _extends3.default)({}, event, {
				target: (0, _extends3.default)({}, event.target, {
					value: value
				})
			});

			// For `redux-form` event detection.
			// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
			_event.stopPropagation = event.stopPropagation;
			_event.preventDefault = event.preventDefault;

			onBlur(_event);
		}
	};

	this.on_autocomplete_input_change = function (event) {
		var options = _this7.props.options;

		var input = event.target.value;
		var matching_options = _this7.get_matching_options(options, input);

		_this7.setState({
			autocomplete_input_value: input,
			matching_options: matching_options,
			focused_option_value: matching_options.length > 0 ? matching_options[0].value : undefined
		});
	};
};

exports.default = Select;


Select.Separator = function (props) {
	return _react2.default.createElement('div', { className: 'rrui__select__separator' });
};

var native_expanded_select_container_style = {
	display: 'inline-block'
};

// There can be an `undefined` value,
// so just `{ value }` won't do here.
function get_option_key(value) {
	return value_is_empty(value) ? '@@rrui/select/undefined' : value;
}

function value_is_empty(value) {
	return value === null || value === undefined;
}
//# sourceMappingURL=select.js.map