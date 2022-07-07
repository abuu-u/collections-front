import MuiLink, { LinkProps as MuiLinkProperties } from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import NextLink, { LinkProps as NextLinkProperties } from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

const Anchor = styled('a')({})

interface NextLinkComposedProperties
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProperties, 'href' | 'as' | 'onClick' | 'onMouseEnter'> {
  to: NextLinkProperties['href']
  linkAs?: NextLinkProperties['as']
}

export const NextLinkComposed = React.forwardRef<
  HTMLAnchorElement,
  NextLinkComposedProperties
>(function NextLinkComposed(properties, reference) {
  const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } =
    properties

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
    >
      <Anchor ref={reference} {...other} />
    </NextLink>
  )
})

export type LinkProperties = {
  activeClassName?: string
  as?: NextLinkProperties['as']
  href: NextLinkProperties['href']
  linkAs?: NextLinkProperties['as']
  noLinkStyle?: boolean
} & Omit<NextLinkComposedProperties, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProperties, 'href'>

const Link = React.forwardRef<HTMLAnchorElement, LinkProperties>(function Link(
  properties,
  reference,
) {
  const {
    activeClassName = 'active',
    as,
    className: classNameProperties,
    href,
    linkAs: linkAsProperty,
    locale,
    noLinkStyle,
    prefetch,
    replace,
    role,
    scroll,
    shallow,
    ...other
  } = properties

  const router = useRouter()
  const pathname = typeof href === 'string' ? href : href.pathname
  const className = clsx(classNameProperties, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  })

  const isExternal =
    typeof href === 'string' &&
    (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0)

  if (isExternal) {
    if (noLinkStyle) {
      return (
        <Anchor className={className} href={href} ref={reference} {...other} />
      )
    }

    return (
      <MuiLink className={className} href={href} ref={reference} {...other} />
    )
  }

  const linkAs = linkAsProperty || as
  const nextjsProperties = {
    to: href,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
  }

  if (noLinkStyle) {
    return (
      <NextLinkComposed
        className={className}
        ref={reference}
        {...nextjsProperties}
        {...other}
      />
    )
  }

  return (
    <MuiLink
      component={NextLinkComposed}
      className={className}
      ref={reference}
      {...nextjsProperties}
      {...other}
    />
  )
})

export default Link
