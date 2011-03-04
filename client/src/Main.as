package
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	
	public class Main extends Sprite
	{
		var sock:Socket;
		
		public function Main()
		{	
			sock = new Socket("127.0.0.1", 8124);
			
			buffer = new ByteArray();
			
			sock.addEventListener(Event.CONNECT, onConnect);
			sock.addEventListener(ProgressEvent.SOCKET_DATA, onData);
		}
		
		function onConnect(event:Event):void
		{
			trace("Connected!");
			sock.writeUTF("imhere");
		}
		
		var buffer:ByteArray;
		var pgs:int = 0;
		
		function onData(event:ProgressEvent):void
		{
			while (sock.bytesAvailable > 0) {
				var byte:int = sock.readByte();
				if (byte != 10) {
					buffer.writeByte(byte);
					trace("WRITING " + byte + " TO buFFER");
					trace("NOW AT " + buffer.bytesAvailable + " bytes");
				} else {
					buffer.position = 0;
					trace("BUFFER PROCESSING WITH " + buffer.bytesAvailable);
					process(buffer);
					trace("BUFFER CLEARING WITH " + buffer.bytesAvailable);
					buffer.clear();
					pgs = 0;
				}
			}
		}
		
		private function process(data:ByteArray) {
			var b:ByteArray = new ByteArray();
			trace("LOL u said " + data.bytesAvailable);
			data.readBytes(b, 0, 2);
			var i:int = b.readShort();
			trace("Well I just read " + i);
			
			/*if (str.substr(0, 4) == "What") {
			sock.writeUTF("themoa");
			}*/
		}
	}
}