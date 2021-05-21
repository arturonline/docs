
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.Toast;

public static void BeforeClose(){
	IntentFilter filter = new IntentFilter(Intent.ACTION_SCREEN_ON);
	filter.addAction(Intent.ACTION_SCREEN_OFF);
	filter.addAction(Intent.ACTION_USER_PRESENT);
	
	ShutdownReceiver myReceiver;
	myReceiver = new ShutdownReceiver();
	getApplicationContext().registerReceiver(myReceiver, filter);
}

public static BroadcastReceiver ShutdownReceiver = new BroadcastReceiver()
{
	static int countPowerOff = 0;
	
	public void onReceive(Context context, Intent intent) 
	{
		
		if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF))
		{
			Log.e(">> On receive", "Method:  ACTION_SCREEN_OFF");
			countPowerOff++;
		}
		else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON))
		{
			Log.e(">> On receive", "Method:  ACTION_SCREEN_ON");
		}
		else if(intent.getAction().equals(Intent.ACTION_USER_PRESENT))
		{
			Log.e(">> On receive", "Method:  ACTION_USER_PRESENT");
			if (countPowerOff > 2)
			{
				countPowerOff = 0;
				Toast.makeText(context, "MAIN ACTIVITY IS BEING CALLED ", Toast.LENGTH_LONG).show();
				Intent i = new Intent(context, MainActivity.class);
				i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
				context.startActivity(i);
			}
		}
	}
}