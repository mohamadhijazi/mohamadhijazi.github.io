var inputType = "remote";
var stepped = 0, rowCount = 0, errorCount = 0, firstError;
var start, end;
var firstRun = true;
var maxUnparseLength = 10000;


	

	// Demo invoked
	function convertCVS( url,type)
	{
		if ($(this).prop('disabled') == "true")
			return;
inputType=type;
		stepped = 0;
		rowCount = 0;
		errorCount = 0;
		firstError = undefined;

		var config = buildConfig();
		var input = url;

		if (inputType == "remote")
			input = url;
		else if (inputType == "json")
		//	input = $('#json').val();

		// Allow only one parse at a time
		$(this).prop('disabled', true);

		if (!firstRun)
			console.log("--------------------------------------------------");
		else
			firstRun = false;



		if (inputType == "local")
		{
			if (!$('#files')[0].files.length)
			{
				alert("Please choose at least one file to parse.");
				return enableButton();
			}
			
			$('#files').parse({
				config: config,
				before: function(file, inputElem)
				{
					start = now();
					console.log("Parsing file...", file);
				},
				error: function(err, file)
				{
					console.log("ERROR:", err, file);
					firstError = firstError || err;
					errorCount++;
				},
				complete: function()
				{
					end = now();
					printStats("Done with all files");
				}
			});
		}
		else if (inputType == "json")
		{
			if (!input)
			{
				alert("Please enter a valid JSON string to convert to CSV.");
				return enableButton();
			}

			start = now();
			var csv = Papa.unparse(input, config);
			end = now();

			console.log("Unparse complete");
			console.log("Time:", (end-start || "(Unknown; your browser does not support the Performance API)"), "ms");
			
			if (csv.length > maxUnparseLength)
			{
				csv = csv.substr(0, maxUnparseLength);
				console.log("(Results truncated for brevity)");
			}

			console.log(csv);

	
		}
		else if (inputType == "remote" && !input)
		{
			alert("Please enter the URL of a file to download and parse.");
			return enableButton();
		}
		else
		{
			start = now();
			var results = Papa.parse(input, config);
			console.log("Synchronous results:", results);
			if (config.worker || config.download)
				console.log("Running...");
				return results;
		}
	}

	




function printStats(msg)
{
	if (msg)
		console.log(msg);
	console.log("       Time:", (end-start || "(Unknown; your browser does not support the Performance API)"), "ms");
	console.log("  Row count:", rowCount);
	if (stepped)
		console.log("    Stepped:", stepped);
	console.log("     Errors:", errorCount);
	if (errorCount)
		console.log("First error:", firstError);
}



function buildConfig()
{
	return {
		delimiter: '',
		header: true,
		dynamicTyping: false,
		skipEmptyLines: true,
		preview:  0,
		step:  undefined ,
		encoding:'',
		worker: false,
		comments: '',
		complete: completeFn,
		error: errorFn,
		download: inputType == "remote"
	};
}

function stepFn(results, parser)
{
	stepped++;
	if (results)
	{
		if (results.data)
			rowCount += results.data.length;
		if (results.errors)
		{
			errorCount += results.errors.length;
			firstError = firstError || results.errors[0];
		}
	}
}

function completeFn(results)
{
	end = now();

	if (results && results.errors)
	{
		if (results.errors)
		{
			errorCount = results.errors.length;
			firstError = results.errors[0];
		}
		if (results.data && results.data.length > 0)
			rowCount = results.data.length;
	}

	printStats("Parse complete");
	console.log("    Results:", results);


}

function errorFn(err, file)
{
	end = now();
	console.log("ERROR:", err, file);
	enableButton();
}



function now()
{
	return typeof window.performance !== 'undefined'
			? window.performance.now()
			: 0;
}