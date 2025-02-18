class Snackbar 
{
  static positions = {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left'
  }

  static types = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }

  static defaultConfig = {
    position: Snackbar.positions.TOP_RIGHT,
    timespan: 3000,
    type: Snackbar.types.INFO
  }

  static containerMap = new Map()

  static show( content, config = {} ) 
  {
    const finalConfig = { ...Snackbar.defaultConfig, ...config }
    const container = this.getContainer(finalConfig.position)
    const snackbar = this.createSnackbarElement(content, finalConfig)
    
    container.appendChild(snackbar)
    
    // Trigger reflow to enable animation
    snackbar.offsetHeight

    // Show snackbar
    snackbar.classList.add('snackbar-visible')

    // Auto remove after timespan
    setTimeout(() => {
      snackbar.classList.remove('snackbar-visible')
      snackbar.addEventListener('transitionend', () => {
        snackbar.remove()
        // Remove container if empty
        if( container.children.length === 0 ) {
          container.remove()
          Snackbar.containerMap.delete(finalConfig.position)
        }
      })
    }, finalConfig.timespan)

    return snackbar
  }

  static getContainer( position ) 
  {
    if( Snackbar.containerMap.has(position) ) {
      return Snackbar.containerMap.get(position)
    }

    const container = document.createElement('div')
    container.className = `snackbar-container snackbar-${position}`
    document.body.appendChild(container)
    Snackbar.containerMap.set(position, container)
    return container
  }

  static createSnackbarElement( content, config ) 
  {
    const snackbar = document.createElement('div')
    snackbar.className = `snackbar snackbar-${config.type}`
    
    if( typeof content === 'string' ) {
      snackbar.innerHTML = content
    } else if( content instanceof HTMLElement ) {
      snackbar.appendChild(content)
    }
    
    return snackbar
  }

  // Shortcut for success messages
  static success( content, position = null, timespan = null ) 
  {
    return Snackbar.show(content, {
      type: Snackbar.types.SUCCESS,
      ...(position && { position }),
      ...(timespan && { timespan })
    })
  }

  // Shortcut for error messages
  static error( content, position = null, timespan = null ) 
  {
    return Snackbar.show(content, {
      type: Snackbar.types.ERROR,
      ...(position && { position }),
      ...(timespan && { timespan })
    })
  }

  // Shortcut for warning messages
  static warning( content, position = null, timespan = null ) 
  {
    return Snackbar.show(content, {
      type: Snackbar.types.WARNING,
      ...(position && { position }),
      ...(timespan && { timespan })
    })
  }

  // Shortcut for info messages
  static info( content, position = null, timespan = null ) 
  {
    return Snackbar.show(content, {
      type: Snackbar.types.INFO,
      ...(position && { position }),
      ...(timespan && { timespan })
    })
  }
}
