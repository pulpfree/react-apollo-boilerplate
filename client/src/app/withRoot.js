import React, { Component } from 'react'
import { JssProvider } from 'react-jss'
import { withStyles, MuiThemeProvider } from 'material-ui/styles'
import wrapDisplayName from 'recompose/wrapDisplayName'
import createContext from '../styles/createContext'

// Apply some reset
const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      margin: 0,
      fontFamily: 'Roboto, sans-serif',
    },
  },
})

let AppWrapper = props => props.children
AppWrapper = withStyles(styles)(AppWrapper)

const context = createContext()

function withRoot(BaseComponent) {
  class WithRoot extends Component {
    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    render() {
      return (
        <JssProvider
            jss={context.jss}
            registry={context.sheetsRegistry}
        >
          <MuiThemeProvider
              sheetsManager={context.sheetsManager}
              theme={context.theme}
          >
            <AppWrapper>
              <BaseComponent {...this.props} />
            </AppWrapper>
          </MuiThemeProvider>
        </JssProvider>
      )
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    WithRoot.displayName = wrapDisplayName(BaseComponent, 'withRoot')
  }

  return WithRoot
}

export default withRoot
