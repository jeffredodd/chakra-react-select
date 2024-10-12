import { Box, Span, useSlotRecipe } from "@chakra-ui/react";
import type { HTMLChakraProps, SystemStyleObject } from "@chakra-ui/react";
import type {
  GroupBase,
  GroupHeadingProps,
  GroupProps,
  MenuListProps,
  MenuProps,
  NoticeProps,
  OptionProps,
} from "react-select";
import type { SizeProps } from "../types";
import { cleanCommonProps, useColorModeValue, useSize } from "../utils";
import { CheckIcon } from "./icons";

export const Menu = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: MenuProps<Option, IsMulti, Group>
) => {
  const {
    className,
    cx,
    children,
    innerProps,
    innerRef,
    placement,
    selectProps: { chakraStyles },
  } = props;

  // const selectStyles = useSlotRecipe({ key: "select" })({ size, variant });

  const initialCss: SystemStyleObject = {
    // TODO: Make this work
    // ...selectStyles.positioner,
    position: "absolute",
    ...(placement === "top" ? { bottom: "100%" } : { top: "100%" }),
    marginY: "8px",
    width: "100%",
    zIndex: 1,
  };

  const css = chakraStyles?.menu
    ? chakraStyles.menu(initialCss, props)
    : initialCss;

  return (
    <Box
      {...innerProps}
      ref={innerRef}
      className={cx({ menu: true }, className)}
      css={css}
    >
      {children}
    </Box>
  );
};

export const MenuList = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: MenuListProps<Option, IsMulti, Group>
) => {
  const {
    className,
    cx,
    innerRef,
    children,
    maxHeight,
    isMulti,
    innerProps,
    selectProps: { chakraStyles, size, variant },
  } = props;

  const selectStyles = useSlotRecipe({ key: "select" })({ size, variant });

  const initialCss: SystemStyleObject = {
    ...selectStyles.content,
    maxHeight: `${maxHeight}px`,
    WebkitOverflowScrolling: "touch",
  };

  const css = chakraStyles?.menuList
    ? chakraStyles.menuList(initialCss, props)
    : initialCss;

  return (
    <Box
      {...innerProps}
      className={cx(
        {
          "menu-list": true,
          "menu-list--is-multi": isMulti,
        },
        className
      )}
      css={css}
      ref={innerRef}
    >
      {children}
    </Box>
  );
};

export const LoadingMessage = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: NoticeProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    cx,
    innerProps,
    selectProps: { chakraStyles, size: sizeProp },
  } = props;

  const size = useSize(sizeProp);

  const verticalPaddings: SizeProps = {
    sm: "6px",
    md: "8px",
    lg: "10px",
  };

  const initialCss: SystemStyleObject = {
    color: "fg.subtle",
    textAlign: "center",
    paddingY: verticalPaddings[size],
    fontSize: size,
  };

  const css = chakraStyles?.loadingMessage
    ? chakraStyles.loadingMessage(initialCss, props)
    : initialCss;

  return (
    <Box
      {...innerProps}
      className={cx(
        {
          "menu-notice": true,
          "menu-notice--loading": true,
        },
        className
      )}
      css={css}
    >
      {children}
    </Box>
  );
};

export const NoOptionsMessage = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: NoticeProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    cx,
    innerProps,
    selectProps: { chakraStyles, size: sizeProp },
  } = props;

  const size = useSize(sizeProp);

  const verticalPaddings: SizeProps = {
    sm: "6px",
    md: "8px",
    lg: "10px",
  };

  const initialCss: SystemStyleObject = {
    color: "fg.subtle",
    textAlign: "center",
    paddingY: verticalPaddings[size],
    fontSize: size,
  };

  const css = chakraStyles?.noOptionsMessage
    ? chakraStyles.noOptionsMessage(initialCss, props)
    : initialCss;

  return (
    <Box
      {...innerProps}
      className={cx(
        {
          "menu-notice": true,
          "menu-notice--no-options": true,
        },
        className
      )}
      css={css}
    >
      {children}
    </Box>
  );
};

export const Group = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: GroupProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    cx,
    theme,
    getStyles,
    Heading,
    headingProps,
    label,
    selectProps,
    innerProps,
    getClassNames,
  } = props;

  const { chakraStyles } = selectProps;

  const initialCss: SystemStyleObject = {};
  const css = chakraStyles?.group
    ? chakraStyles.group(initialCss, props)
    : initialCss;

  return (
    <Box {...innerProps} className={cx({ group: true }, className)} css={css}>
      <Heading
        {...headingProps}
        selectProps={selectProps}
        cx={cx}
        theme={theme}
        getStyles={getStyles}
        getClassNames={getClassNames}
      >
        {label}
      </Heading>
      <Box>{children}</Box>
    </Box>
  );
};

export const GroupHeading = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: GroupHeadingProps<Option, IsMulti, Group>
) => {
  const {
    cx,
    className,
    selectProps: { chakraStyles, size, variant },
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, ...innerProps } = cleanCommonProps(props);

  const selectStyles = useSlotRecipe({ key: "select" })({ size, variant });

  const initialCss: SystemStyleObject = {
    ...selectStyles.itemGroupLabel,
  };

  const css = chakraStyles?.groupHeading
    ? chakraStyles.groupHeading(initialCss, props)
    : initialCss;

  return (
    <Box
      {...innerProps}
      className={cx({ "group-heading": true }, className)}
      css={css}
    />
  );
};

/**
 * The `CheckIcon` component from the Chakra UI Menu
 *
 * @see {@link https://github.com/chakra-ui/chakra-ui/blob/eb0316ddf96dd259433724062e923c33e6eee729/packages/components/menu/src/menu-item-option.tcss#L10-L17}
 */
// const CheckIcon = () => (
//   <svg
//     viewBox="0 0 14 14"
//     width="1em"
//     height="1em"
//     focusable="false"
//     aria-hidden="true"
//   >
//     <polygon
//       fill="currentColor"
//       points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"
//     />
//   </svg>
// );

const MenuIcon: React.FC<HTMLChakraProps<"span">> = (props) => (
  <Span {...props}>
    <CheckIcon />
  </Span>
);

export const Option = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  props: OptionProps<Option, IsMulti, Group>
) => {
  const {
    className,
    cx,
    innerRef,
    innerProps,
    children,
    isFocused,
    isDisabled,
    isSelected,
    selectProps: {
      chakraStyles,
      isMulti,
      hideSelectedOptions,
      selectedOptionStyle,
      selectedOptionColorPalette,
      size,
      variant,
    },
  } = props;

  const selectStyles = useSlotRecipe({ key: "select" })({ size, variant });

  /**
   * Use the same selected color as the border/shadow of the select/input components
   *
   * @see {@link https://github.com/chakra-ui/chakra-ui/blob/61f965a/packages/components/theme/src/components/input.ts#L92-L93}
   */
  const selectedBg = useColorModeValue(
    `${selectedOptionColorPalette}.500`,
    `${selectedOptionColorPalette}.300`
  );
  const selectedColor = useColorModeValue("white", "black");

  // Don't create exta space for the checkmark if using a multi select with
  // options that dissapear when they're selected
  const showCheckIcon =
    selectedOptionStyle === "check" &&
    (!isMulti || hideSelectedOptions === false);

  const shouldHighlight = selectedOptionStyle === "color" && isSelected;

  const initialCss: SystemStyleObject = {
    ...selectStyles.item,
    cursor: "pointer",
    ...(shouldHighlight
      ? {
          bg: selectedBg,
          color: selectedColor,
          _active: { bg: selectedBg },
        }
      : {}),
  };

  const css = chakraStyles?.option
    ? chakraStyles.option(initialCss, props)
    : initialCss;

  return (
    <Box
      {...innerProps}
      className={cx(
        {
          option: true,
          "option--is-disabled": isDisabled,
          "option--is-focused": isFocused,
          "option--is-selected": isSelected,
        },
        className
      )}
      css={css}
      ref={innerRef}
      data-highlighted={isFocused ? true : undefined}
      aria-disabled={isDisabled ? true : undefined}
      aria-selected={isSelected}
    >
      {children}
      {showCheckIcon && (
        <MenuIcon css={{ ...selectStyles.itemIndicator }} hidden={!isSelected}>
          <CheckIcon />
        </MenuIcon>
      )}
    </Box>
  );
};
