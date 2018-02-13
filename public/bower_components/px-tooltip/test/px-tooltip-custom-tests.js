
suite('Custom Automation Tests for px-tooltip', function() {
  let px_tooltip;

  suiteSetup((done)=>{
    px_tooltip = Polymer.dom(document).querySelector('#px_tooltip_1');
    flush(()=>{
      done();
    })
  });

  test('hides tooltip before click', function() {
    assert.isFalse(px_tooltip.visible);
  });

  test('reflects the "for" property', function() {
    assert.equal(px_tooltip.attributes.for.value, "hoverDivTop");
  });

  test('reflects the "delay" property', function() {
     assert.equal(px_tooltip.delay, 500);
  });

  test('reflects the "orientation" property', function() {
     assert.equal(px_tooltip.orientation, "top");
  });

  test('reflects the "tooltip-message" property', function() {
     assert.equal(px_tooltip.tooltipMessage, "Top tooltip");
  });

   suite('when tooltip is shown', function() {

     test('when _show called', function(done) {

      assert.isFalse(px_tooltip.openRequested);
      px_tooltip.set('opened', true);
      assert.isTrue(px_tooltip.openRequested);
      async.until(
        ()=> px_tooltip.visible,
        (cb)=>{
          setTimeout(()=>{cb()}, 1000); // delay is 500 ms
        },
        ()=>{
          assert.isTrue(px_tooltip.visible);
          assert.isFalse(px_tooltip.openRequested);
          done();
        }
      )

     });
   });
  });

suite('Large text string tooltip', done=> {
  test('Check max width of tooltip', done=> {
    let px_tooltip_large;
    let tooltip_classes;
    async.until(
      ()=> {
        px_tooltip_large = Polymer.dom(document).querySelector('#px_tooltip_9');
        tooltip_classes = Polymer.dom(px_tooltip_large.root).querySelector('.tooltip-container');
        return !!tooltip_classes;
      },
      (cb)=>{
        setTimeout(()=>{cb()}, 1000); // delay is 500 ms
      },
      ()=>{
        let tooltip_text = px_tooltip_large.tooltipMessage,
        width_styles = window.getComputedStyle( tooltip_classes ).getPropertyValue( 'max-width' );
        if (tooltip_text.length > 52){
          assert.equal(width_styles, '400px');
          done();
        }
      }
    )
  });
});

//
// // Object
suite('Custom Automation Tests for px-tooltip', function() {
  let px_tooltip;
  let target;

  setup(()=>{
    px_tooltip = Polymer.dom(document).querySelector('#px_tooltip_8');
    target =  Polymer.dom(document).querySelector('#hoverDivTop5');
    px_tooltip_8.for = target;
  });

  test('hides tooltip before click', function() {
    assert.isFalse(px_tooltip.visible);
  });

  test('"for" property is object', function() {
     assert.equal(typeof(px_tooltip.for), 'object');
  });

  test('reflects the "for" property', function() {
     assert.equal(px_tooltip.for, target);
  });

});

suite('when tooltip is shown', function() {
  let px_tooltip;
  let target;

  setup(()=>{
    px_tooltip = Polymer.dom(document).querySelector('#px_tooltip_8');
    target =  Polymer.dom(document).querySelector('#hoverDivTop5');
    px_tooltip_8.set('for',target);
  });

  test('when _show called', function(done) {
    assert.isFalse(px_tooltip.openRequested);
    px_tooltip.set('opened', true);
    assert.isTrue(px_tooltip.openRequested);
    setTimeout(function() {
      assert.isTrue(px_tooltip.visible);
      assert.isFalse(px_tooltip.openRequested);
      done();
    }, 1000); // delay is 500 ms
  });
});
