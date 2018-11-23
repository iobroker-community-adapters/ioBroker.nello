/**
 * Status Message
 *
 *
 */
function log(message, severity, id)
{
	var log = $(id || '#log').html();
	$(id || '#log').html(log + '<span class="log ' + (severity || 'info') + ' translate">' + message + '</span>');
	console.log((severity !== undefined ? severity.toUpperCase() : 'INFO') + ': ' + message);
}


/**
 * Load settings.
 *
 *
 */
function load(settings, onChange)
{
	if (!settings)
		return;
	
	$('.value').each(function()
	{            
		var $key = $(this);
		var id = $key.attr('id');
		
		// load certificates
		if ($key.attr('data-select') === "certificate")
			fillSelectCertificates('#'+id,  $key.attr('data-type') || '', settings[id]);
		
		// load settings
		if ($key.attr('type') === 'checkbox')
			$key.prop('checked', settings[id]).trigger('change').on('change', function() {onChange()});
		
		else
			$key.val(settings[id]).on('change', function() {onChange()}).on('keyup', function() {onChange()});
	});
	
	onChange(false);
	M.updateTextFields();
}


/**
 * Save settings.
 *
 *
 */
function save(callback)
{
	var obj = {};
	$('.value').each(function()
	{
		var $this = $(this);
		var key = $this.attr('id');
		
		if ($this.attr('type') === 'checkbox')
			obj[key] = $this.prop('checked');
		
		else if ($this.attr('data-select') === "certificate")
		{
			socket.emit('getObject', 'system.certificates', function (err, res) {
				if (res.native.certificates !== undefined)
				{
					obj[key] = $this.val();
					obj[key + 'Val'] = res.native.certificates[$this.val()];
				}
			});
		}
		
		else
			obj[key] = settings.decode.fields.indexOf(key) > -1 ? decode(settings.decode.key, $this.val()) : $this.val();
	});
	
	callback(obj);
}
